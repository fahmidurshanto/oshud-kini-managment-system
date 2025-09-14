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
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '50%',
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

const DashboardReport = ({ dashboardData }) => {
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