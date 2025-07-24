import { StyleSheet, Dimensions } from 'react-native';

export const common = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // flexGrow: 1,
    alignItems: 'stretch',
    // flex: 1,
    paddingTop: 32,
    paddingHorizontal: 10,
    width: '100%',
  },
  contentWrapper: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 30,
    color: '#222',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '400'
  },
  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 56,
    marginTop: 5,
  },
  brownButton: {
    width: '100%',
    backgroundColor: '#2E1404',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    height: 66,
    justifyContent: 'center',
    marginBottom: 16,
  },
  brownButtonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  errorMsg: {
    color: 'red',
    fontSize: 13,
    marginLeft: 4,
    margin: 0,
  },
  star: {
    color: '#FF0000',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    height: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
}); 