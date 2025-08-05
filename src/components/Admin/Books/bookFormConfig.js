export const BOOK_FORM_CONFIG = {
  labels: [
    "รูปปก",
    "ISBN",
    "เรื่อง",
    "ตัวแทนจำหน่าย",
    "สำนักพิมพ์",
    "ผู้แต่ง",
    "ผู้แปล",
    "หมวดหมู่",
    "ต้นทุน",
    "ราคา",
    "เนื้อเรื่อง",
    "น้ำหนัก (kg)",
    "ปีพิมพ์",
  ],

  fields: [
    {
      name: "ISBN",
      label: "ISBN",
      type: "text",
      required: true,
      disabledOnEdit: true,
    },
    {
      name: "title",
      label: "เรื่อง",
      type: "text",
      required: true,
    },
    {
      name: "supplier_name",
      label: "ตัวแทนจำหน่าย",
      type: "supplier",
      required: true,
      editOnly: true,
    },
    {
      name: "publisher",
      label: "สำนักพิมพ์",
      type: "publisher",
      required: true,
    },
    {
      name: "author",
      label: "ผู้แต่ง",
      type: "text",
    },
    {
      name: "translator",
      label: "ผู้แปล",
      type: "text",
    },
    {
      name: "genre",
      label: "หมวดหมู่",
      type: "genre",
      required: true,
    },
    {
      name: "base_price",
      label: "ต้นทุน",
      type: "number",
    },
    {
      name: "price",
      label: "ราคา",
      type: "number",
      required: true,
    },
    {
      name: "desc",
      label: "เนื้อเรื่อง",
      type: "textarea",
    },
    {
      name: "weight",
      label: "น้ำหนัก (kg)",
      type: "number",
    },
    {
      name: "published_year",
      label: "ปีพิมพ์",
      type: "number",
    },
  ],

  getInitialValues: (book = null, supplier = null) => {
    if (book) {
      return {
        ISBN: book.ISBN || "",
        title: book.title || "",
        supplier_name: book.supplier_name || "",
        publisher: book.publisher || "",
        author: book.author || "",
        translator: book.translator || "",
        genre: book.genre || "",
        base_price: book.base_price || "",
        price: book.price || "",
        desc: book.desc || "",
        weight: book.weight || "",
        published_year: book.published_year || "",
      };
    }

    return {
      ISBN: "",
      title: "",
      supplier_name: supplier?.supplier_name || "",
      publisher: "",
      author: "",
      translator: "",
      genre: "",
      base_price: "",
      price: "",
      desc: "",
      weight: "",
      published_year: "",
    };
  },
};
