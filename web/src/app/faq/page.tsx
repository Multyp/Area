'use client';

import { Accordion, AccordionSummary, AccordionDetails, Typography, Container, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Layout from '@/layout';

const FAQPage = () => {
  const faqData = [
    {
      question: 'What is our product?',
      answer: 'Our product is a state-of-the-art solution designed to help you manage your tasks efficiently and collaboratively.',
    },
    {
      question: 'How can I create an account?',
      answer:
        "To create an account, simply click on the 'Sign Up' button on the homepage and follow the instructions. You'll need a valid email address to register.",
    },
    {
      question: 'Is there a free version available?',
      answer: 'Yes! We offer a free version with basic features. You can upgrade to our premium plans for more advanced functionality.',
    },
    {
      question: 'How do I reset my password?',
      answer: "If you forgot your password, click the 'Forgot Password' link on the login page and follow the instructions to reset it.",
    },
    {
      question: 'How can I contact support?',
      answer: "You can reach our support team through the 'Contact Us' page, or email us at support@ourproduct.com.",
    },
  ];

  return (
    <Layout variant="landing">
      <Container maxWidth="md" sx={{ paddingY: '14rem', marginBottom: '10rem' }}>
        <Box textAlign="center" marginBottom="2rem">
          <Typography variant="h4" component="h1" gutterBottom>
            Help Center
          </Typography>
          <Typography variant="subtitle1">Find answers to common questions about our product below.</Typography>
        </Box>
        {faqData.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Layout>
  );
};

export default FAQPage;
