const escpos = require("escpos");
escpos.Network = require("escpos-network");
const device = new escpos.Network("192.168.123.100", 9100);
const printer = new escpos.Printer(device);
const items = [
  {
    ISBN: "9817124378793",
    title: "เจ้าชายน้อย",
    quantity: 1,
    price: 365,
    discount: 0,
    total: 365.0,
  },
  {
    ISBN: "9618793171008",
    title: "The new book of time",
    quantity: 2,
    price: 200,
    discount: (50.5).toFixed(0),
    total: (349).toFixed(0),
  },
];

export default function handlePrint() {
  device.open(function (error) {
    if (error) {
      console.error(error);
      return;
    }
    printer.align("ct");
    printer.encode("TIS-620").text("ร้านหนังสือบุ๊คทรี");
    printer
      .encode("TIS-620")
      .text("19 ม.2 ต.บางนายสี อ.ตะกั่วป่า จ.พังงา 82110");
    printer.encode("TIS-620").text("โทร. 076-471499");
    printer.encode("TIS-620").text("เลขประจำตัวเสียภาษี 1234567890");
    printer.tableCustom([
      { text: "วันที่ 01/08/2566", align: "LEFT", width: 0.5 },
      { text: "เวลา 15:39:11", align: "RIGHT", width: 0.5 },
    ]);

    //   printer.encode("TIS-620").text("เลขสมชิก 0948025972");

    printer.drawLine();
    printer.tableCustom([
      { text: "ชื่อสินค้า", align: "LEFT", width: 0.4 },
      { text: "ราคา", align: "CENTER", width: 9.15 },
      { text: "ส่วนลด", align: "CENTER", width: 0.15 },
      { text: "รวมทั้งหมด", align: "CENTER", width: 0.3 },
    ]);
    items.map((book) => {
      printer.tableCustom([
        {
          text:
            (book.title.length > 12
              ? book.title.substring(0, 12) + "..."
              : book.title) +
            " (" +
            book.quantity +
            ")",
          align: "LEFT",
          width: 0.4,
        },
        { text: book.price, align: "CENTER", width: 0.15 },
        { text: book.discount, align: "CENTER", width: 0.15 },
        { text: book.total, align: "CENTER", width: 0.3 },
      ]);
    });
    printer.drawLine();
    printer.tableCustom([
      { text: "รวมทั้งหมด", align: "LEFT", width: 0.5, style: "B" },
      { text: "714.00", align: "RIGHT", width: 0.5 },
    ]);
    printer.tableCustom([
      { text: "เงินสด", align: "LEFT", width: 0.5, style: "B" },
      { text: "800.00", align: "RIGHT", width: 0.5 },
    ]);
    printer.tableCustom([
      { text: "เงินทอน", align: "LEFT", width: 0.5, style: "B" },
      {
        text: parseFloat((800 - 714).toFixed(0)).toFixed(2),
        align: "RIGHT",
        width: 0.5,
      },
    ]);
    printer.drawLine();
    printer.cut();
    printer.close();
  });
}
