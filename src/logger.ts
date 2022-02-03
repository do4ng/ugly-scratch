export default function log(message: string | object): void {
  if (window.location.hash === "#dev") {
    console.log(message);
  }
}
