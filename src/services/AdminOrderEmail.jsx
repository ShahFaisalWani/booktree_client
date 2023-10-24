import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const thaiMonthNames = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const AdminOrderEmail = ({ userDetail, order_date, order_num }) => {
  const date = new Date(order_date);
  const user = JSON.parse(localStorage.getItem("user_order"));
  const cart = JSON.parse(localStorage.getItem("cart"));
  const shipping = JSON.parse(localStorage.getItem("shipping"));

  const main = {
    paddingTop: "30px",
    backgroundColor: "#dbddde",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };

  const container = {
    margin: "30px auto",
    width: "610px",
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
  };

  const heading = {
    fontSize: "14px",
    lineHeight: "26px",
    fontWeight: "700",
    color: "#004dcf",
  };

  const paragraphContent = {
    padding: "10px 40px",
  };

  const paragraph = {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#3c4043",
  };

  const cartTotal = () => {
    let sum = 0;
    Object.keys(cart.items).map((item) => {
      sum += cart.items[item].price * cart.items[item].quantity;
    });
    return sum.toFixed(2);
  };

  const totalDiscount = () => {
    let sum = 0;
    Object.keys(cart.items).map((item) => {
      sum += cart.items[item].discount * cart.items[item].quantity;
    });
    return sum.toFixed(2);
  };

  const cartSize = () => {
    let sum = 0;
    Object.keys(cart.items).map((item) => {
      sum += cart.items[item].quantity;
    });
    return sum;
  };
  const calcNet = () => {
    let sum = 0;
    Object.keys(cart.items).map((item) => {
      sum +=
        (cart.items[item].price - cart.items[item].discount) *
        cart.items[item].quantity;
    });
    sum += parseInt(shipping.price) - parseInt(shipping.discount);
    return sum.toFixed(2);
  };

  return (
    <Html>
      <Head />
      <Preview>แจ้งเตือนคำสั่งซื้อใหม่</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section
            style={{
              ...paragraphContent,
              backgroundColor: "#004dcf",
              marginBottom: "10px",
            }}
          >
            <Text
              style={{
                color: "#eeeeee",
                fontSize: "20px",
              }}
            >
              แจ้งเตือนคำสั่งซื้อใหม่หมายเลข {order_num}
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>แจ้งเตือนคำสั่งซื้อใหม่</Text>
            <Text style={paragraph}>
              หมายเลขคำสั่งซื้อ: {order_num} เมื่อ {date.getDate()}{" "}
              {thaiMonthNames[date.getMonth()]} {date.getFullYear() + 543}{" "}
              {date.toTimeString().slice(0, 5)}
            </Text>
            <Text style={paragraph}>
              ชื่อลูกค้า: {userDetail.first_name} {userDetail.last_name}
            </Text>
            <Text style={paragraph}>อีเมลลูกค้า: {userDetail.email}</Text>
            <Text style={paragraph}>
              เบอร์ลูกค้า: {userDetail.phone_number}
            </Text>
            <Text style={paragraph}>ราคารวมทั้งหมด: {calcNet()} บาท</Text>
            <Text style={paragraph}>
              นี่คือรายการสินค้าที่ท่านได้สั่งซื้อไป:
            </Text>
          </Section>

          <Section style={{ ...paragraphContent, width: "100%" }}>
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "10%",
                  padding: "5px",
                }}
              >
                No.
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "60%",
                  padding: "5px",
                }}
              >
                ชื้อสินค้า
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "20%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                ราคา
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "10%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                จำนวน
              </Column>
            </Row>
            {Object.keys(cart.items).map((item, i) => (
              <Row key={item} style={{ borderCollapse: "collapse" }}>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "10%",
                    padding: "5px",
                  }}
                >
                  {i + 1}
                </Column>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "60%",
                    padding: "5px",
                  }}
                >
                  {cart.items[item].title.length > 35
                    ? cart.items[item].title.substring(0, 33) + "..."
                    : cart.items[item].title}
                </Column>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "20%",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  {cart.items[item].price}
                </Column>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "10%",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  {cart.items[item].quantity}
                </Column>
              </Row>
            ))}
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "70%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                รวมทั้งหมด
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "20%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {cartTotal()}
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "10%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {cartSize()}
              </Column>
            </Row>
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "70%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                ส่วนลดทั้งหมด
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "20%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {totalDiscount()}
              </Column>
              <Column
                style={{
                  width: "10%",
                  padding: "5px",
                  border: "1px solid black",
                }}
              ></Column>
            </Row>
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "70%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                ค่าส่ง
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "20%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {shipping.price.toFixed(2)}
              </Column>
              <Column
                style={{
                  width: "10%",
                  padding: "5px",
                  border: "1px solid black",
                }}
              ></Column>
            </Row>
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "70%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                ส่วนลดค่าส่ง
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "20%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {shipping.discount.toFixed(2)}
              </Column>
              <Column
                style={{
                  width: "10%",
                  padding: "5px",
                  border: "1px solid black",
                }}
              ></Column>
            </Row>
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "70%",
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                ราคาสุทธิ
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "20%",
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {calcNet()}
              </Column>
              <Column
                style={{
                  width: "10%",
                  padding: "5px",
                  border: "1px solid black",
                  fontWeight: 700,
                }}
              >
                บาท
              </Column>
            </Row>
          </Section>

          <Section
            style={{
              ...paragraphContent,
            }}
          >
            <Text style={{ color: "#004dcf", fontSize: "17px" }}>
              จัดส่งไปยังที่อยู่
            </Text>
            <Text style={paragraph}>
              {shipping.label == "รับที่ร้าน" ? "รับที่ร้าน" : user.address}
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>ขอบคุณเป็นอย่างยิ่ง,</Text>
            <Text style={{ ...paragraph, fontSize: "20px" }}>Booktree</Text>
          </Section>

          <Section style={{ ...paragraphContent, width: "540px" }}>
            <Text
              style={{
                ...paragraph,
                fontSize: "12px",
                textAlign: "center",
                margin: 0,
              }}
            >
              © 2023 Booktree, All Rights Reserved
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminOrderEmail;
