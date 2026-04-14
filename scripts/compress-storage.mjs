/**
 * Supabase Storage Image Compressor — 2-Phase Approach
 * 
 * Phase 1 (download): Downloads all images, saves originals, compresses locally
 *   node scripts/compress-storage.mjs download
 * 
 * Phase 2 (upload): Uploads compressed images back to Supabase, overwriting originals
 *   node scripts/compress-storage.mjs upload
 */

import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Config ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yhmvfouigexsqnxccpah.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const BUCKETS = ['images', 'gallery']
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const JPEG_QUALITY = 75
const MIN_SIZE_BYTES = 50 * 1024  // Skip files under 50KB

const BASE_DIR = path.join(__dirname, '..', '_image_backup')
const ORIGINALS_DIR = path.join(BASE_DIR, 'originals')
const COMPRESSED_DIR = path.join(BASE_DIR, 'compressed')

// ========== PHASE 1: DOWNLOAD & COMPRESS LOCALLY ==========

async function listAllFiles(bucket) {
    const allFiles = []
    let offset = 0
    const limit = 100

    while (true) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list('', { limit, offset, sortBy: { column: 'name', order: 'asc' } })

        if (error) {
            console.error(`❌ Error listing ${bucket}:`, error.message)
            break
        }

        if (!data || data.length === 0) break

        const imageFiles = data.filter(f =>
            !f.id?.startsWith('.') &&
            f.name &&
            /\.(jpg|jpeg|png|webp|gif|avif|bmp|tiff?)$/i.test(f.name)
        )
        allFiles.push(...imageFiles)

        if (data.length < limit) break
        offset += limit
    }

    return allFiles
}

async function phaseDownload() {
    console.log('='.repeat(60))
    console.log('📥 PHASE 1: Download & Compress Locally')
    console.log('='.repeat(60))
    console.log(`  Max dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}`)
    console.log(`  JPEG Quality:   ${JPEG_QUALITY}%`)
    console.log(`  Skip under:     ${MIN_SIZE_BYTES / 1024}KB`)
    console.log(`  Output dir:     ${BASE_DIR}`)
    console.log('='.repeat(60))
    console.log()

    // Ensure dirs exist
    for (const bucket of BUCKETS) {
        fs.mkdirSync(path.join(ORIGINALS_DIR, bucket), { recursive: true })
        fs.mkdirSync(path.join(COMPRESSED_DIR, bucket), { recursive: true })
    }

    let totalFiles = 0
    let compressedCount = 0
    let skippedCount = 0
    let errorCount = 0
    let totalOriginalSize = 0
    let totalCompressedSize = 0
    const manifest = [] // Track what was compressed for upload phase

    for (const bucket of BUCKETS) {
        console.log(`📂 Bucket: "${bucket}"`)
        const files = await listAllFiles(bucket)
        console.log(`   Found ${files.length} image files\n`)

        for (const file of files) {
            totalFiles++
            const fileName = file.name

            try {
                // Download
                const { data: fileData, error: downloadError } = await supabase.storage
                    .from(bucket)
                    .download(fileName)

                if (downloadError || !fileData) {
                    console.error(`  ❌ Download failed: ${fileName}`, downloadError?.message)
                    errorCount++
                    continue
                }

                const originalBuffer = Buffer.from(await fileData.arrayBuffer())
                const originalSize = originalBuffer.length
                totalOriginalSize += originalSize

                // Save original locally
                fs.writeFileSync(path.join(ORIGINALS_DIR, bucket, fileName), originalBuffer)

                // Skip tiny files
                if (originalSize < MIN_SIZE_BYTES) {
                    console.log(`  ⏭️  ${fileName} (${(originalSize / 1024).toFixed(0)}KB) — under ${MIN_SIZE_BYTES / 1024}KB, skipping`)
                    totalCompressedSize += originalSize
                    skippedCount++
                    continue
                }

                // Compress
                const metadata = await sharp(originalBuffer).metadata()
                let pipeline = sharp(originalBuffer)

                if ((metadata.width && metadata.width > MAX_WIDTH) || (metadata.height && metadata.height > MAX_HEIGHT)) {
                    pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                }

                const compressedBuffer = await pipeline
                    .jpeg({ quality: JPEG_QUALITY, progressive: true })
                    .toBuffer()

                const compressedSize = compressedBuffer.length

                // If compression didn't help, skip
                if (compressedSize >= originalSize) {
                    console.log(`  ⏭️  ${fileName} (${(originalSize / 1024).toFixed(0)}KB) — can't compress further, skipping`)
                    totalCompressedSize += originalSize
                    skippedCount++
                    continue
                }

                // Save compressed locally
                fs.writeFileSync(path.join(COMPRESSED_DIR, bucket, fileName), compressedBuffer)
                totalCompressedSize += compressedSize
                compressedCount++

                const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1)
                console.log(`  ✅ ${fileName}: ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB (${reduction}% smaller)`)

                manifest.push({ bucket, fileName, originalSize, compressedSize })

            } catch (err) {
                console.error(`  ❌ Error: ${fileName}:`, err.message)
                errorCount++
            }
        }
        console.log()
    }

    // Save manifest for upload phase
    fs.writeFileSync(path.join(BASE_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))

    // Report
    const savedMB = ((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)
    console.log('='.repeat(60))
    console.log('📊 PHASE 1 REPORT')
    console.log('='.repeat(60))
    console.log(`  Total files:       ${totalFiles}`)
    console.log(`  Will compress:     ${compressedCount}`)
    console.log(`  Skipped:           ${skippedCount}`)
    console.log(`  Errors:            ${errorCount}`)
    console.log(`  Original total:    ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  After compression: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Space saved:       ${savedMB} MB`)
    console.log(`  Reduction:         ${totalOriginalSize > 0 ? ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1) : 0}%`)
    console.log('='.repeat(60))
    console.log()
    console.log('📁 Check the compressed images in:')
    console.log(`   ${COMPRESSED_DIR}`)
    console.log()
    console.log('🔒 Originals backed up in:')
    console.log(`   ${ORIGINALS_DIR}`)
    console.log()
    console.log('👉 When ready, run: node scripts/compress-storage.mjs upload')
}

// ========== PHASE 2: UPLOAD COMPRESSED IMAGES ==========

async function phaseUpload() {
    const manifestPath = path.join(BASE_DIR, 'manifest.json')

    if (!fs.existsSync(manifestPath)) {
        console.error('❌ No manifest.json found. Run "download" phase first.')
        process.exit(1)
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

    console.log('='.repeat(60))
    console.log('📤 PHASE 2: Upload Compressed Images to Supabase')
    console.log('='.repeat(60))
    console.log(`  Files to upload: ${manifest.length}`)
    console.log('='.repeat(60))
    console.log()

    let uploaded = 0
    let errors = 0

    for (const entry of manifest) {
        const { bucket, fileName, originalSize, compressedSize } = entry
        const compressedPath = path.join(COMPRESSED_DIR, bucket, fileName)

        if (!fs.existsSync(compressedPath)) {
            console.error(`  ❌ Missing: ${compressedPath}`)
            errors++
            continue
        }

        const buffer = fs.readFileSync(compressedPath)

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: 'image/jpeg',
                upsert: true
            })

        if (uploadError) {
            console.error(`  ❌ Upload failed: ${bucket}/${fileName}`, uploadError.message)
            errors++
        } else {
            uploaded++
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1)
            console.log(`  ✅ ${bucket}/${fileName} — replaced (${reduction}% smaller)`)
        }
    }

    console.log()
    console.log('='.repeat(60))
    console.log('📊 UPLOAD COMPLETE')
    console.log('='.repeat(60))
    console.log(`  Uploaded:  ${uploaded}`)
    console.log(`  Errors:    ${errors}`)
    console.log('='.repeat(60))

    if (errors === 0) {
        console.log()
        console.log('🎉 All done! Your Supabase storage is now optimized.')
        console.log('   The live site URLs are unchanged — zero impact.')
        console.log()
        console.log('   You can delete the _image_backup folder when you\'re satisfied.')
    }
}

// ========== MAIN ==========

const command = process.argv[2]

if (command === 'upload') {
    phaseUpload().catch(console.error)
} else if (command === 'download' || !command) {
    phaseDownload().catch(console.error)
} else {
    console.log('Usage:')
    console.log('  node scripts/compress-storage.mjs download   — Phase 1: Download & compress')
    console.log('  node scripts/compress-storage.mjs upload     — Phase 2: Upload compressed files')
}
