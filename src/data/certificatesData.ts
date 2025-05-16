export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  category: string;
  description: string;
  credentialUrl?: string;
}

export const certificates: Certificate[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `Certificate ${i + 1}`,
  issuer: ['Coursera', 'Udemy', 'edX', 'freeCodeCamp', 'LinkedIn Learning', 'Google', 'Microsoft'][i % 7],
  date: `${2020 + Math.floor(i / 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
  image: `/certificates/certificate${i + 1}.jpeg`,
  category: ['Web Development', 'Data Science', 'UI/UX Design', 'Cloud Computing', 'Machine Learning'][i % 5],
  description: 'This certificate validates expertise in advanced concepts and practical applications in the field.',
  credentialUrl: i % 3 === 0 ? 'https://example.com/credential' : undefined
}));
