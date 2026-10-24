import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

const HR_EMAIL = 'auspikpharma@gmail.com';
const MAX_RESUME_SIZE = 600 * 1024;

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(reader.error || new Error('Unable to read resume file.'));
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      resolve(reader.result);
    } else {
      reject(new Error('Unable to read resume file.'));
    }
  };
  reader.readAsDataURL(file);
});

const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

export const submitCareerApplication = async ({ job, applicant, resumeFile }) => {
  if (!db) {
    throw new Error('Application submission is unavailable. Please try again later.');
  }
  if (resumeFile && (
    resumeFile.size > MAX_RESUME_SIZE
    || !/\.(pdf|doc|docx)$/i.test(resumeFile.name)
  )) {
    throw new Error('Choose a PDF or Word document smaller than 600 KB.');
  }

  const resumeDataUrl = resumeFile ? await fileToDataUrl(resumeFile) : null;

  const applicationRef = doc(collection(db, 'careerApplications'));
  const batch = writeBatch(db);
  const details = {
    fullName: applicant.fullName.trim(),
    email: applicant.email.trim(),
    phone: applicant.phone.trim(),
    experience: applicant.experience.trim(),
    currentLocation: applicant.currentLocation.trim(),
    coverNote: applicant.coverNote.trim(),
    resumeName: resumeFile?.name || ''
  };
  const safeDetails = Object.fromEntries(
    Object.entries(details).map(([key, value]) => [key, escapeHtml(value)])
  );
  const messageText = [
    `New application for ${job.title}`,
    `Name: ${details.fullName}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    `Experience: ${details.experience}`,
    `Location: ${details.currentLocation || 'Not provided'}`,
    `Resume: ${details.resumeName || 'Not attached'}`,
    `Message: ${details.coverNote || 'Not provided'}`
  ].join('\n');
  const messageHtml = `
    <h2>New application: ${escapeHtml(job.title)}</h2>
    <p><strong>Name:</strong> ${safeDetails.fullName}</p>
    <p><strong>Email:</strong> ${safeDetails.email}</p>
    <p><strong>Phone:</strong> ${safeDetails.phone}</p>
    <p><strong>Experience:</strong> ${safeDetails.experience}</p>
    <p><strong>Location:</strong> ${safeDetails.currentLocation || 'Not provided'}</p>
    <p><strong>Resume:</strong> ${safeDetails.resumeName || 'Not attached'}</p>
    <p><strong>Message:</strong><br>${safeDetails.coverNote || 'Not provided'}</p>
  `;

  batch.set(applicationRef, {
    ...details,
    jobId: job.id,
    jobTitle: job.title,
    department: job.department,
    createdAt: serverTimestamp(),
    status: 'new'
  });
  batch.set(doc(collection(db, 'mail')), {
    to: HR_EMAIL,
    replyTo: details.email,
    applicationId: applicationRef.id,
    message: {
      subject: `Job application: ${job.title}`,
      text: messageText,
      html: messageHtml,
      ...(resumeDataUrl && resumeFile ? {
        attachments: [{ filename: resumeFile.name, path: resumeDataUrl }]
      } : {})
    }
  });
  batch.set(doc(collection(db, 'mail')), {
    to: details.email,
    applicationId: applicationRef.id,
    message: {
      subject: `We received your application for ${job.title}`,
      text: `Hello ${details.fullName},\n\nThank you for applying for the ${job.title} position at Auspik Pharmaceuticals. Our HR team has received your application and will be in touch if your experience matches the role.\n\nRegards,\nAuspik Pharmaceuticals`,
      html: `<p>Hello ${escapeHtml(details.fullName)},</p><p>Thank you for applying for the <strong>${escapeHtml(job.title)}</strong> position at Auspik Pharmaceuticals.</p><p>Our HR team has received your application and will be in touch if your experience matches the role.</p><p>Regards,<br>Auspik Pharmaceuticals</p>`
    }
  });

  await batch.commit();
};
