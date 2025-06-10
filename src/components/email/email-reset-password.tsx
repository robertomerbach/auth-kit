import * as React from 'react';

interface ResetPasswordEmailProps {
  resetLink: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({
  resetLink,
}) => {
  return (
    <>
      <tr>
        <td style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', paddingBottom: '20px' }}>
          We received a request to reset the password for your account. If you made this request, click the button below to create a new password.
        </td>
      </tr>

      <tr>
        <td style={{ padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>
          <a
            href={resetLink}
            style={{
              backgroundColor: '#ff4c4c',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '6px',
              width: '-webkit-fill-available',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            Reset Password
          </a>
        </td>
      </tr>

      <tr>
        <td style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', paddingBottom: '10px', paddingTop: '20px' }}>
          This link is valid for 1 hour. After that, you&apos;ll need to request a new password reset.
        </td>
      </tr>

      <tr>
        <td style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
          If you didn&apos;t request this change, you can safely ignore this message—your current password will remain unchanged.
        </td>
      </tr>
    </>
  );
};