import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const textStyle = {
  color: "#eeeeee",
  fontSize: "20px",
};

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

const paragraphContent = {
  padding: "10px 40px",
};

const OrderSupplier = ({ supplier, date }) => {
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
            }}
          >
            <Text style={textStyle}>เรียน ฝ่ายขาย {supplier.full_name}</Text>
            <Text style={textStyle}>
              ร้านบุ๊คทรี ขอส่งรายการสั่งหนังสือประจำวันที่ {date}{" "}
              ตามรายละเอียดใน file ที่แนบมานี้
            </Text>
            <Text style={textStyle}>มาเรีย อุมาสะ</Text>
            <Text style={textStyle}>ผู้จัดการร้าน</Text>
            <Text style={textStyle}>โทร 095 025 9234</Text>
            <Text style={textStyle}>ขอบคุณค่ะ</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderSupplier;
