import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function HomeScreen() {
  const openLinkedIn = () => {
    Linking.openURL('https://www.linkedin.com/in/khanh-le-timo/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <Text style={styles.name}>Le Viet Khanh</Text>
        <Text style={styles.mssv}>MSSV: 21110206</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.description}>
          Xin chào! Tôi là Le Viet Khanh, sinh viên với mã số 21110206.
          Đây là bài tập tuần 1 về React Navigation.
        </Text>

        <TouchableOpacity style={styles.linkedinButton} onPress={openLinkedIn}>
          <Text style={styles.linkedinIcon}>🔗</Text>
          <Text style={styles.linkedinText}>LinkedIn Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  mssv: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  linkedinButton: {
    flexDirection: 'row',
    backgroundColor: '#0077B5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  linkedinIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  linkedinText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
