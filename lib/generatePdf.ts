import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateDailyGuestListPDF = (date: string, groupedData: any[]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Reset HTX - Guest List: ${date}`, 14, 20);

    let startY = 30;

    groupedData.forEach((event) => {
        // Add Event Header
        const displayDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '';
        doc.setFontSize(14);
        doc.text(`Event: ${event.eventName} ${displayDate ? `(${displayDate})` : ''}`, 14, startY);

        // Generate Table for this event
        const tableData = event.guests.map((g: any) => [
            g.guest_name,
            g.booking_ref,
            g.ticket_type,
            g.table_selection || 'N/A',
            g.quantity.toString()
        ]);

        autoTable(doc, {
            startY: startY + 5,
            head: [['Guest Name', 'Booking ID', 'Type', 'Table', 'Qty']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [20, 20, 20] }, // Dark header for Reset branding
            margin: { top: 10 }
        });

        // Update Y position for the next event (if any)
        startY = (doc as any).lastAutoTable.finalY + 15;

        // Check if we need a new page for the next event to avoid cutting off
        if (startY > doc.internal.pageSize.height - 30) {
            doc.addPage();
            startY = 20; // reset to top of new page
        }
    });

    doc.save(`GuestList_${date}.pdf`);
};

