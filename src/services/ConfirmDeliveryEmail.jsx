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

const ConfirmDeliverEmail = ({ track_id, customerObj }) => {
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

  const paragraph = {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#3c4043",
  };

  return (
    <Html>
      <Head />
      <Preview>ยืนยันการจัดส่งสินค้า</Preview>
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
              ยืนยันการจัดส่งคำสั่งซื้อหมายเลข: {customerObj.order_id}
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <Text style={{ ...paragraph, marginBottom: "20px" }}>
              สวัสดีคุณ {customerObj.customer_first_name},
            </Text>
            <Text style={paragraph}>
              เราขอแจ้งให้ทราบว่าการสั่งซื้อของคุณถูกจัดส่งเรียบร้อยแล้ว
            </Text>
            <Text style={paragraph}>รายละเอียดการจัดส่ง</Text>
            <Text style={paragraph}>Flash Express</Text>
            <Text style={paragraph}>หมายเลขพัสดุ: {track_id}</Text>
            <Text style={paragraph}>
              สามารถติดตามพัสดุได้ทาง: https://flashexpress.com/fle/tracking
            </Text>
            <Text style={{ ...paragraph, marginTop: "20px" }}>
              นี่คือรายการสินค้าที่ท่านได้สั่งซื้อไป:
            </Text>
          </Section>

          <Section style={{ ...paragraphContent, width: "100%" }}>
            <Row style={{ borderCollapse: "collapse" }}>
              <Column
                style={{
                  border: "1px solid black",
                  width: "15%",
                  padding: "5px",
                }}
              >
                No.
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "70%",
                  padding: "5px",
                }}
              >
                ชื้อสินค้า
              </Column>
              <Column
                style={{
                  border: "1px solid black",
                  width: "15%",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                จำนวน
              </Column>
            </Row>
            {customerObj.order_details.map((item, i) => (
              <Row key={i} style={{ borderCollapse: "collapse" }}>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "15%",
                    padding: "5px",
                  }}
                >
                  {i + 1}
                </Column>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "70%",
                    padding: "5px",
                  }}
                >
                  {item.book.title.length > 40
                    ? item.book.title.substring(0, 37) + "..."
                    : item.book.title}
                </Column>
                <Column
                  style={{
                    border: "1px solid black",
                    width: "15%",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </Column>
              </Row>
            ))}
          </Section>

          <Section
            style={{
              ...paragraphContent,
            }}
          >
            <Text style={{ color: "#004dcf", fontSize: "17px" }}>
              จัดส่งไปยังที่อยู่
            </Text>
            <Text style={paragraph}>{customerObj.deliver_to}</Text>
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

export default ConfirmDeliverEmail;
