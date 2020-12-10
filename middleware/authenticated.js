export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.accountInfo) {
    return redirect({ name: 'login' })
  }
}
