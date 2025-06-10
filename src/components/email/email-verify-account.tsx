import * as React from 'react';

interface VerifyAccountEmailProps {
  code: string;
}

export const VerifyAccountEmail = ({
  code,
}: VerifyAccountEmailProps) => {
  return (
    <div>
      <div style={{ 
        fontSize: '14px', 
        color: '#555', 
        lineHeight: '1.6', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Thank you for creating an account. Use the code below to verify your email address.
      </div>

      <div style={{ 
        textAlign: 'center',
        margin: '30px 0',
        padding: '30px 20px',
        backgroundColor: 'rgb(250, 250, 250)',
        borderRadius: '8px'
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          color: '#000'
        }}>
          {code}
        </div>
      </div>

      <div style={{ 
        fontSize: '14px', 
        color: '#666', 
        lineHeight: '1.6',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        This code will expire in 10 minutes. If you did not request this code, please ignore this email.
      </div>
    </div>
  );
};