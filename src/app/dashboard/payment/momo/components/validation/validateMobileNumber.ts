// /utils/validateMobileNumber.ts
export const networkPrefixes: Record<string, RegExp> = {
    MTN: /^(?:0|234|\+233)(?:50|54|55|56|57|59)\d{7}$/,
    TELECEL: /^(?:0|234|\+233)(?:20|24|25|26|27|28|29)\d{7}$/,
    AIRTELTIGO: /^(?:0|234|\+233)(?:23|28|26|27)\d{7}$/, // adjust to AirtelTigo prefixes
  };
  
  export const validateMobileNumber = (network: string, number: string) => {
    const regex = networkPrefixes[network];
    if (!regex) return false;
    return regex.test(number);
  };
  