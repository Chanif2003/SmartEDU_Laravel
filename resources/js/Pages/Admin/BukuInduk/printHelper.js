import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateBiodataPDF = (student) => {
    if (!student) return;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });
    const pageWidth = doc.internal.pageSize.getWidth(); // ~420mm

    // Header
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("II. LEMBAR BUKU INDUK SISWA SMK", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(`NOMOR INDUK SISWA : ${student.nis || ''} ....................................`, pageWidth / 2, 28, { align: "center" });
    
    const leftColX = 20;
    const rightColX = pageWidth / 2 + 5;
    const dotX = 65; // Position of colon from column start
    const valueX = 68; // Start of value from column start
    const maxValWidth = (pageWidth / 2) - valueX - 25; // Limit value width

    let currentY = 35;
    const rowHeight = 5.2; // Balanced row height for A3

    const addSectionHeader = (title, x, y) => {
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text(title, x, y);
      return y + rowHeight + 1;
    };

    const addRow = (num, label, value, x, y, isSub = false) => {
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      const indent = isSub ? 7 : 0;
      const labelText = num ? `${num}. ${label}` : `    ${label}`;
      
      const truncatedLabel = doc.getTextWidth(labelText) > dotX - 5 
        ? doc.splitTextToSize(labelText, dotX - 5)[0] 
        : labelText;
      
      doc.text(truncatedLabel, x + indent, y);
      
      const colonX = x + dotX;
      doc.text(":", colonX, y);
      
      const valX = x + valueX;
      const displayValue = value || "..........................................................................................";
      
      const truncatedValue = doc.getTextWidth(displayValue) > maxValWidth 
        ? doc.splitTextToSize(displayValue, maxValWidth)[0] 
        : displayValue;
        
      doc.text(truncatedValue, valX, y);
      
      return y + rowHeight;
    };

    // LEFT COLUMN
    let yL = currentY;
    yL = addSectionHeader("A. KETERANGAN TENTANG SISWA", leftColX, yL);
    yL = addRow("1", "Nama Siswa", "", leftColX, yL);
    yL = addRow("", "a. Nama lengkap", student.nama_lengkap || '', leftColX, yL, true);
    yL = addRow("", "b. Nama panggilan", "", leftColX, yL, true);
    yL = addRow("2", "Jenis kelamin", student.gender || '', leftColX, yL);
    yL = addRow("3", "Tempat dan tanggal lahir", `${student.tempat_lahir || ''}, ${student.tanggal_lahir || ''}`, leftColX, yL);
    yL = addRow("4", "Agama", student.agama || '', leftColX, yL);
    yL = addRow("5", "Kewarganegaraan", "Indonesia", leftColX, yL);
    yL = addRow("6", "Anak ke", "", leftColX, yL);
    yL = addRow("7", "Jumlah saudara kandung", "", leftColX, yL);
    yL = addRow("8", "Jumlah saudara tiri", "", leftColX, yL);
    yL = addRow("9", "Jumlah saudara angkat", "", leftColX, yL);
    yL = addRow("10", "Anak yatim/piatu/yatim piatu", "", leftColX, yL);
    yL = addRow("11", "Bahasa sehari-hari di rumah", "", leftColX, yL);

    yL += 2;
    yL = addSectionHeader("B. KETERANGAN TEMPAT TINGGAL", leftColX, yL);
    yL = addRow("12", "Alamat", student.alamat || '', leftColX, yL);
    yL = addRow("", "", "", leftColX, yL); // Extra line for address
    yL = addRow("13", "Nomor telepon", student.no_telepon || '', leftColX, yL);
    yL = addRow("14", "Tinggal dengan Orang Tua/", "", leftColX, yL);
    yL = addRow("", "Saudara/Asrama/Kost", "Orang Tua", leftColX, yL, true);
    yL = addRow("15", "Jarak tempat tinggal dari sekolah", "", leftColX, yL);

    yL += 2;
    yL = addSectionHeader("C. KETERANGAN KESEHATAN", leftColX, yL);
    yL = addRow("16", "Golongan Darah", "", leftColX, yL);
    yL = addRow("17", "Penyakit yang pernah diderita", "", leftColX, yL);
    yL = addRow("", "TBC/Cacar/Malaria/dan lain-lain", "", leftColX, yL, true);
    yL = addRow("18", "Kelainan jasmani", "", leftColX, yL);
    yL = addRow("19", "Tinggi dan berat badan", "", leftColX, yL);

    yL += 2;
    yL = addSectionHeader("D. KETERANGAN PENDIDIKAN", leftColX, yL);
    yL = addRow("20", "Pendidikan sebelumnya", "", leftColX, yL);
    yL = addRow("", "a. Lulusan dari", student.origin_school || '', leftColX, yL, true);
    yL = addRow("", "b. Tanggal dan Nomor STTB", "", leftColX, yL, true);
    yL = addRow("", "c. Lama belajar", "", leftColX, yL, true);
    yL = addRow("21", "Pindahan", "", leftColX, yL);
    yL = addRow("", "a. Dari sekolah", "", leftColX, yL, true);
    yL = addRow("", "b. Alamat", "", leftColX, yL, true);
    yL = addRow("22", "Diterima di sekolah ini", "", leftColX, yL);
    yL = addRow("", "a. Di kelas", student.school_class?.name || '', leftColX, yL, true);
    yL = addRow("", "b. Program", "", leftColX, yL, true);
    yL = addRow("", "c. Tanggal", student.entry_date || new Date().toLocaleDateString('id-ID'), leftColX, yL, true);

    yL += 2;
    yL = addSectionHeader("E. KETERANGAN TENTANG AYAH KANDUNG", leftColX, yL);
    yL = addRow("23", "Nama", student.nama_ayah || '', leftColX, yL);
    yL = addRow("24", "Tempat dan tanggal lahir", "", leftColX, yL);
    yL = addRow("25", "Agama", "", leftColX, yL);
    yL = addRow("26", "Kewarganegaraan", "", leftColX, yL);
    yL = addRow("27", "Pendidikan", "", leftColX, yL);

    // RIGHT COLUMN
    let yR = currentY;
    yR = addRow("28", "Pekerjaan", "", rightColX, yR);
    yR = addRow("29", "Penghasilan perbulan", "", rightColX, yR);
    yR = addRow("30", "Alamat rumah", student.alamat || '', rightColX, yR);
    yR = addRow("", "Nomor telepon", student.no_telepon_ortu || '', rightColX, yR, true);
    yR = addRow("31", "Masih hidup / meninggal dunia tahun", "", rightColX, yR);

    yR += 2;
    yR = addSectionHeader("F. KETERANGAN TENTANG IBU KANDUNG", rightColX, yR);
    yR = addRow("32", "Nama", student.nama_ibu || '', rightColX, yR);
    yR = addRow("33", "Tempat dan tanggal lahir", "", rightColX, yR);
    yR = addRow("34", "Agama", "", rightColX, yR);
    yR = addRow("35", "Kewarganegaraan", "", rightColX, yR);
    yR = addRow("36", "Pendidikan", "", rightColX, yR);
    yR = addRow("37", "Pekerjaan", "", rightColX, yR);
    yR = addRow("38", "Penghasilan perbulan", "", rightColX, yR);
    yR = addRow("39", "Alamat rumah", student.alamat || '', rightColX, yR);
    yR = addRow("", "Nomor telepon", student.no_telepon_ortu || '', rightColX, yR, true);
    yR = addRow("40", "Masih hidup / meninggal dunia tahun", "", rightColX, yR);

    yR += 2;
    yR = addSectionHeader("G. KETERANGAN TENTANG WALI", rightColX, yR);
    yR = addRow("41", "Nama", student.nama_wali || '', rightColX, yR);
    yR = addRow("42", "Tempat dan tanggal lahir", "", rightColX, yR);
    yR = addRow("43", "Agama", "", rightColX, yR);
    yR = addRow("44", "Kewarganegaraan", "", rightColX, yR);
    yR = addRow("45", "Pendidikan", "", rightColX, yR);
    yR = addRow("46", "Pekerjaan", "", rightColX, yR);
    yR = addRow("47", "Penghasilan perbulan", "", rightColX, yR);
    yR = addRow("48", "Alamat rumah", "", rightColX, yR);
    yR = addRow("", "Nomor telepon", "", rightColX, yR, true);

    yR += 2;
    yR = addSectionHeader("H. KEGEMARAN SISWA", rightColX, yR);
    yR = addRow("49", "Kesenian", "", rightColX, yR);
    yR = addRow("50", "Olahraga", "", rightColX, yR);
    yR = addRow("51", "Kemasyarakatan / Organisasi", "", rightColX, yR);
    yR = addRow("52", "Lain-lain", "", rightColX, yR);

    yR += 2;
    yR = addSectionHeader("I. KETERANGAN PERKEMBANGAN SISWA", rightColX, yR);
    yR = addRow("53", "Menerima Beasiswa", "Tahun ........... / Kelas ........... dan ...........", rightColX, yR);
    yR = addRow("", "", "Tahun ........... / Kelas ........... dan ...........", rightColX, yR);
    yR = addRow("", "", "Tahun ........... / Kelas ........... dan ...........", rightColX, yR);
    yR = addRow("54", "Meninggalkan sekolah", "", rightColX, yR);
    yR = addRow("", "a. Tanggal", student.exit_date || "", rightColX, yR, true);
    yR = addRow("", "b. Alasan", student.exit_reason || "", rightColX, yR, true);
    yR = addRow("55", "Akhir Pendidikan", "", rightColX, yR);
    yR = addRow("", "a. Tamat Belajar", student.is_alumni ? "Tamat" : "", rightColX, yR, true);
    yR = addRow("", "b. STTB Nomor", "", rightColX, yR, true);

    yR += 2;
    yR = addSectionHeader("J. KETERANGAN SETELAH SELESAI PENDIDIKAN", rightColX, yR);
    yR = addRow("56", "Melanjutkan di", "", rightColX, yR);
    yR = addRow("57", "Bekerja", "", rightColX, yR);
    yR = addRow("", "a. Tanggal mulai kerja", "", rightColX, yR, true);
    yR = addRow("", "b. Nama Perusahaan", "", rightColX, yR, true);
    yR = addRow("", "dan lain-lain", "", rightColX, yR, true);

    // Photo Boxes
    const photoWidth = 30;
    const photoHeight = 40;
    const photoX = pageWidth - 45;

    // Top Photo Box
    const topPhotoY = 45;
    doc.rect(photoX, topPhotoY, photoWidth, photoHeight);
    doc.setFontSize(8);
    doc.text("Pas Photo", photoX + 8, topPhotoY + 15);
    doc.text("Ukuran 3x4", photoX + 7, topPhotoY + 20);
    doc.text("waktu diterima", photoX + 5, topPhotoY + 25);
    doc.text("di sekolah ini", photoX + 7, topPhotoY + 30);

    // Bottom Photo Box
    const bottomPhotoY = 225;
    doc.rect(photoX, bottomPhotoY, photoWidth, photoHeight);
    doc.text("Pas Photo", photoX + 8, bottomPhotoY + 15);
    doc.text("Ukuran 3x4", photoX + 7, bottomPhotoY + 20);
    doc.text("waktu diterima", photoX + 5, bottomPhotoY + 25);
    doc.text("di sekolah ini", photoX + 7, bottomPhotoY + 30);

    doc.save(`Buku_Induk_A3_${student.nama_lengkap.replace(/\s+/g, '_')}.pdf`);
};

export const generateFullTranscriptPDF = (student) => {
    if (!student) return;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("III. LAPORAN PENILAIAN HASIL BELAJAR SISWA SMK", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.text(`NAMA SISWA : ${(student.nama_lengkap || '').padEnd(50, '.')}`, 20, 25);
    doc.text(`NOMOR INDUK SISWA : ${(student.nis || '').padEnd(30, '.')}`, 140, 25);
    doc.text(`PROGRAM : ............................................................`, 260, 25);

    const reportCards = student.report_cards || [];

    // Helper to get grade for a subject and semester
    const getGrade = (subject, semesterIndex) => {
      const targetSemester = reportCards[semesterIndex];
      if (!targetSemester) return null;

      const score = targetSemester.scores?.find(s => 
        s.learning_objective?.subject?.name?.toLowerCase()?.includes(subject.toLowerCase())
      );
      return score ? score.final_score : null;
    };

    const getGradeLetter = (grade) => {
      if (grade === null || grade === undefined) return "";
      if (grade >= 85) return "A";
      if (grade >= 75) return "B";
      if (grade >= 60) return "C";
      return "D";
    };

    // Extract subjects
    const allSubjects = [];
    reportCards.forEach(rc => {
        rc.scores?.forEach(s => {
            if (s.learning_objective?.subject?.name && !allSubjects.includes(s.learning_objective.subject.name)) {
                allSubjects.push(s.learning_objective.subject.name);
            }
        });
    });

    const normatif = ["Pendidikan Agama", "Pendidikan Kewarganegaraan", "PKN", "Bahasa Indonesia", "Penjaskes", "Seni Budaya"];
    const adaptif = ["Bahasa Inggris", "Matematika", "Ilmu Pengetahuan Alam", "Ilmu Pengetahuan Sosial", "Fisika", "Kimia", "Kewirausahaan", "KKPI"];
    const mulok = ["Bahasa Arab", "Bahasa Daerah"];
    
    const produktifSubjects = allSubjects.filter(s => 
      !normatif.some(n => s.toLowerCase().includes(n.toLowerCase())) &&
      !adaptif.some(a => s.toLowerCase().includes(a.toLowerCase())) &&
      !mulok.some(m => s.toLowerCase().includes(m.toLowerCase()))
    );

    const tableData = [];

    // A. NORMATIF
    tableData.push([{ content: 'A', styles: { fontStyle: 'bold' } }, { content: 'NORMATIF', styles: { fontStyle: 'bold' } }, ...Array(14).fill('')]);
    const actualNormatif = allSubjects.filter(s => normatif.some(n => s.toLowerCase().includes(n.toLowerCase())));
    const displayNormatif = actualNormatif.length > 0 ? actualNormatif : normatif.slice(0,3);

    displayNormatif.forEach((sub, i) => {
      const row = [i + 1, sub];
      for (let s = 0; s < 6; s++) {
        const g = getGrade(sub, s);
        row.push(g || "");
        row.push(getGradeLetter(g));
      }
      row.push("", ""); // STTB
      tableData.push(row);
    });

    // B. ADAPTIF
    tableData.push([{ content: 'B', styles: { fontStyle: 'bold' } }, { content: 'ADAPTIF', styles: { fontStyle: 'bold' } }, ...Array(14).fill('')]);
    const actualAdaptif = allSubjects.filter(s => adaptif.some(n => s.toLowerCase().includes(n.toLowerCase())));
    const displayAdaptif = actualAdaptif.length > 0 ? actualAdaptif : adaptif.slice(0,3);

    displayAdaptif.forEach((sub, i) => {
      const row = [i + 1, sub];
      for (let s = 0; s < 6; s++) {
        const g = getGrade(sub, s);
        row.push(g || "");
        row.push(getGradeLetter(g));
      }
      row.push("", ""); // STTB
      tableData.push(row);
    });

    // C. PRODUKTIF
    tableData.push([{ content: 'C', styles: { fontStyle: 'bold' } }, { content: 'PRODUKTIF', styles: { fontStyle: 'bold' } }, ...Array(14).fill('')]);
    const displayProduktif = produktifSubjects.length > 0 ? produktifSubjects : ["Kompetensi Kejuruan"];
    displayProduktif.forEach((sub, i) => {
      const row = [i + 1, sub];
      for (let s = 0; s < 6; s++) {
        const g = getGrade(sub, s);
        row.push(g || "");
        row.push(getGradeLetter(g));
      }
      row.push("", "");
      tableData.push(row);
    });
    // Add empty rows if produktif is short to maintain layout
    for (let i = displayProduktif.length; i < 5; i++) {
      tableData.push([i + 1, "", ...Array(14).fill("")]);
    }

    // D. MULOK
    tableData.push([{ content: 'D', styles: { fontStyle: 'bold' } }, { content: 'MULOK', styles: { fontStyle: 'bold' } }, ...Array(14).fill('')]);
    const actualMulok = allSubjects.filter(s => mulok.some(m => s.toLowerCase().includes(m.toLowerCase())));
    const displayMulok = actualMulok.length > 0 ? actualMulok : ["Bahasa Daerah"];
    displayMulok.forEach((sub, i) => {
      const row = [i + 1, sub];
      for (let s = 0; s < 6; s++) {
        const g = getGrade(sub, s);
        row.push(g || "");
        row.push(getGradeLetter(g));
      }
      row.push("", "");
      tableData.push(row);
    });

    tableData.push(['', { content: 'Jumlah Nilai', styles: { fontStyle: 'bold' } }, ...Array(14).fill("")]);

    doc.autoTable({
      startY: 30,
      head: [
        [
          { content: 'NO', rowSpan: 4, styles: { halign: 'center', valign: 'middle' } },
          { content: 'MATA PELAJARAN', rowSpan: 4, styles: { halign: 'center', valign: 'middle' } },
          { content: 'TAHUN PELAJARAN', colSpan: 12, styles: { halign: 'center' } },
          { content: 'STTB', colSpan: 2, styles: { halign: 'center' } }
        ],
        [
          { content: 'KELAS', colSpan: 12, styles: { halign: 'center' } },
          { content: 'TAHUN', colSpan: 2, styles: { halign: 'center' } }
        ],
        [
          { content: 'SEMESTER', colSpan: 12, styles: { halign: 'center' } },
          { content: 'NILAI STTB', colSpan: 2, styles: { halign: 'center' } }
        ],
        [
          { content: '1', colSpan: 2, styles: { halign: 'center' } },
          { content: '2', colSpan: 2, styles: { halign: 'center' } },
          { content: '3', colSpan: 2, styles: { halign: 'center' } },
          { content: '4', colSpan: 2, styles: { halign: 'center' } },
          { content: '5', colSpan: 2, styles: { halign: 'center' } },
          { content: '6', colSpan: 2, styles: { halign: 'center' } },
          { content: 'ANGKA', styles: { halign: 'center' } },
          { content: 'HURUF', styles: { halign: 'center' } }
        ]
      ],
      body: tableData,
      theme: 'grid',
      styles: { font: 'times', fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
      }
    });

    doc.save(`Buku_Induk_Transkrip_${student.nama_lengkap.replace(/\s+/g, '_')}.pdf`);
};
