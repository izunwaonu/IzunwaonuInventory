
//  * Generates a random six-figure OTP (One-Time Password) as a string.
//  * @returns A string containing a random 6-digit number.

export function generateOTP(): string {
    // Generate a random number between 0 and 999999
    const randomNumber = Math.floor(Math.random() * 1000000);
    
    // Convert to string and pad with leading zeros if necessary to ensure 6 digits
    const otp = randomNumber.toString().padStart(6, '0');
    
    return otp;
  }
  
