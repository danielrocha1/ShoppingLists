import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  tableHeader: {
    marginTop:50,
    height: 40,
    backgroundColor: '#941C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableBody: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  cell: {
    borderWidth:.5,
    borderColor:'gray',
    flex: 1,
    fontSize: 14,
    padding: 5,
    color: '#333',
    textAlign: 'center',
  },
  quantityContainer: {
    borderWidth:.5,
    borderColor:'gray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#941C1C',
    marginHorizontal: 5,
  },
  buttonDecrement: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'red',
    marginHorizontal: 5,
    
  },
  buttonDecrementText: {
    fontSize: 14,
    color: 'red',
  },
  buttonIncrement: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'green',
    marginHorizontal: 5,
    
  },
  buttonIncrementText: {
    fontSize: 14,
    color: 'green',
  },
  quantityText: {
    fontSize: 14,
    padding: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;