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
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
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
    width: '50%',
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

const DashboardReport = ({ dashboardData, products, sales, expenses }) => {
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Calculate totals
  const totalProductsValue = products.reduce((sum, product) => sum + (product.price * product.quantity || 0), 0);
  const totalSalesValue = sales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
  const totalExpensesValue = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

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
            <Text>Email: fahmidurrahamanshanto@gmail.com</Text>
            <Text>Phone: +8801640301028</Text>
          </View>
        </View>

        {/* Report title */}
        <Text style={styles.title}>DASHBOARD REPORT</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Generated on {new Date().toLocaleDateString()}
        </Text>

        {/* Dashboard Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Statistics</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Metric</Text>
              <Text style={styles.tableColHeader}>Value</Text>
            </View>
            {dashboardData.stats.map((stat, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{stat.title}</Text>
                <Text style={styles.tableCol}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Products Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products Summary</Text>
          <View style={styles.row}>
            <Text>Total Products: {products.length}</Text>
            <Text>Total Quantity: {dashboardData.totalProductQuantity || 0}</Text>
            <Text>Total Value: ৳{totalProductsValue.toLocaleString()}</Text>
          </View>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Product Name</Text>
              <Text style={styles.tableColHeader}>Price (৳)</Text>
              <Text style={styles.tableColHeader}>Quantity</Text>
              <Text style={styles.tableColHeader}>Total (৳)</Text>
            </View>
            {products.slice(0, 10).map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{product.name}</Text>
                <Text style={styles.tableCol}>{product.price.toLocaleString()}</Text>
                <Text style={styles.tableCol}>{product.quantity}</Text>
                <Text style={styles.tableCol}>{(product.price * product.quantity).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sales Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>
          <View style={styles.row}>
            <Text>Total Sales: {sales.length}</Text>
            <Text>Total Revenue: ৳{totalSalesValue.toLocaleString()}</Text>
          </View>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Customer</Text>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Items</Text>
              <Text style={styles.tableColHeader}>Amount (৳)</Text>
            </View>
            {sales.slice(0, 10).map((sale, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{sale.customerName}</Text>
                <Text style={styles.tableCol}>{formatDate(sale.saleDate)}</Text>
                <Text style={styles.tableCol}>{sale.items.length}</Text>
                <Text style={styles.tableCol}>{sale.finalAmount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expenses Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses Summary</Text>
          <View style={styles.row}>
            <Text>Total Expenses: {expenses.length}</Text>
            <Text>Total Amount: ৳{totalExpensesValue.toLocaleString()}</Text>
          </View>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Purpose</Text>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Amount (৳)</Text>
              <Text style={styles.tableColHeader}> </Text>
            </View>
            {expenses.slice(0, 10).map((expense, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{expense.purpose}</Text>
                <Text style={styles.tableCol}>{formatDate(expense.expenseDate)}</Text>
                <Text style={styles.tableCol}>{expense.amount.toLocaleString()}</Text>
                <Text style={styles.tableCol}> </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is a computer-generated report and does not require a signature.{'\n'}
          Report generated on {new Date().toLocaleString()}
        </Text>
      </Page>
    </Document>
  );
};

export default DashboardReport;