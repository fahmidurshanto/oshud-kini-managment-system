import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register font (optional)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
  fontWeight: 'normal'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 12,
    fontFamily: 'Roboto'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  logo: {
    width: 80,
    height: 80,
  },
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  customerInfo: {
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row-reverse',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  summaryCol: {
    width: '30%',
    padding: 5,
  },
  summaryValue: {
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 10,
    fontSize: 10,
  },
});

const SaleInvoice = ({ sale }) => {
  // Calculate totals
  const subtotal = sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = sale.discount || 0;
  const finalAmount = sale.finalAmount || subtotal - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="https://i.ibb.co.com/G4m6qKLg/Your-paragraph-text.jpg" 
          />
          <View style={styles.companyInfo}>
            <Text>Oshud Kini Management System</Text>
            <Text>Email: info@oshudkini.com</Text>
            <Text>Phone: +880 XXX XXX XXXX</Text>
          </View>
        </View>

        {/* Invoice title */}
        <Text style={styles.title}>SALES INVOICE</Text>

        {/* Customer and sale info */}
        <View style={styles.customerInfo}>
          <Text><Text style={{ fontWeight: 'bold' }}>Invoice To:</Text> {sale.customerName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Customer Phone:</Text> {sale.customerPhone || 'N/A'}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Invoice Date:</Text> {new Date(sale.saleDate).toLocaleDateString()}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Invoice No:</Text> {sale._id.substring(0, 8).toUpperCase()}</Text>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Total (৳)</Text>
            <Text style={styles.tableColHeader}>Price (৳)</Text>
            <Text style={styles.tableColHeader}>Quantity</Text>
            <Text style={styles.tableColHeader}>Product</Text>
          </View>
          {sale.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{(item.price * item.quantity).toLocaleString()}</Text>
              <Text style={styles.tableCol}>{item.price.toLocaleString()}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>{item.productName}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryValue}>Subtotal: ৳{subtotal.toLocaleString()}</Text>
            {discount > 0 && (
              <Text style={styles.summaryValue}>Discount: ৳{discount.toLocaleString()}</Text>
            )}
            <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>
              Total: ৳{finalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business!{'\n'}
          This is a computer-generated invoice and does not require a signature.
        </Text>
      </Page>
    </Document>
  );
};

export default SaleInvoice;