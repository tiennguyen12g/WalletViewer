function ConvertToShortAddress (addressString: string) {
     // Get the first 6 characters
     const firstPart = addressString.substring(0, 4);
     // Get the last 6 characters
     const lastPart = addressString.substring(addressString.length - 5);
     // Concatenate the first and last parts with "..." in between
     const formattedAddress = `${firstPart} . . . ${lastPart}`;
     return formattedAddress
   }
export {ConvertToShortAddress}