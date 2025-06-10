import * as React from 'react'

interface EmailTemplateProps {
  title: string;
  code: React.ReactNode;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  title,
  code
}) => (
  <table
    width="100%"
    cellPadding="0"
    cellSpacing="0"
    style={{
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px 0',
    }}
  >
    <tbody>
      <tr>
        <td align="center">
          <table
            width="600"
            style={{
              backgroundColor: '#ffffff',
              padding: '40px',
            }}
            cellPadding="0"
            cellSpacing="0"
          >
            <tbody>
              <tr>
                <td style={{ paddingBottom: '30px' }}>
                  <img
                    src="/logo.png"
                    alt="Logo"
                    width="40"
                    height="40"
                    style={{ display: 'block' }}
                  />
                </td>
              </tr>

              <tr>
                <td style={{ paddingBottom: '20px' }}>
                  <h1 style={{ fontSize: '24px', margin: '0', color: '#111' }}>
                    {title}
                  </h1>
                </td>
              </tr>

              <tr>
                <td>
                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ paddingBottom: '20px' }}>
                    <tbody>
                      {code}
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                <td style={{ borderTop: '1px solid #eee', paddingTop: '30px', fontSize: '12px', color: '#888' }}>
                  <p style={{ margin: '0' }}>
                    Flash, Inc., 555 JohnDoe St. San Francisco, CA 97891
                  </p>
                  <p style={{ margin: '10px 0 0' }}>
                    Sent with love by the Flash team
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
);