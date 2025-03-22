import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  interface InvitationEmailProps {
    orgName: string;
    roleName: string;
    linkUrl: string;
  }
  
  const baseUrl = "https://izunwaonu-inventory.vercel.app/";
    
  
  export const UserInvitation = ({
    orgName, roleName,linkUrl ,
  }: InvitationEmailProps) => (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Invitation to Join {orgName} on IzuInventory - {roleName}</Preview>
        <Container style={container}>
           <Img
           src={`${baseUrl}/logo-dark.png`}
           width="489"
           height="113"
           alt="IzuInventory logo"
            />
          <Heading style={h1}>Invitation to Join {orgName} on IzuInventory - {roleName}</Heading>
        <Text style={heroText}>
          Hello, 
        </Text>
        <Text style={heroText}>
        You've been invited to join {orgName} inventory management team 
        as a {roleName} on IzuInventory. As a Secretary, you'll 
        have access to specific inventory management features tailored to your role.
        </Text>
        <Text style={heroText}>
        To get started, please click the button below to set up your account. You'll need to 
        create a password and verify some basic information to complete your registration.
        </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={linkUrl}>
            Accept Invitation & Set Up Account
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  

  export default UserInvitation;
  
  const logo = {
    borderRadius: 21,
    width: 42,
    height: 42,
  };
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  };
  
  const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
  };
  
  const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.4',
    color: '#3c4149',
  };
  
  const buttonContainer = {
    padding: '27px 0 27px',
  };
  
  const button = {
    backgroundColor: '#5e6ad2',
    borderRadius: '3px',
    fontWeight: '600',
    color: '#fff',
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '11px 23px',
  };
  
  const reportLink = {
    fontSize: '14px',
    color: '#b4becc',
  };
  
  const hr = {
    borderColor: '#dfe1e4',
    margin: '42px 0 26px',
  };
  const h1 = {
    color: '#1d1c1d',
    fontSize: '36px',
    fontWeight: '700',
    margin: '30px 0',
    padding: '0',
    lineHeight: '42px',
  };
  
  const heroText = {
    fontSize: '20px',
    lineHeight: '28px',
    marginBottom: '30px',
  };
  
  const code = {
    fontFamily: 'monospace',
    fontWeight: '700',
    padding: '1px 4px',
    backgroundColor: '#dfe1e4',
    letterSpacing: '-0.3px',
    fontSize: '21px',
    borderRadius: '4px',
    color: '#3c4149',
  };
  