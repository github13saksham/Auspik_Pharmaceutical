/**
 * Service to dispatch transactional notification emails via Resend API
 */

export const triggerEmailNotification = async (type, data) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, data })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('Email dispatch warning:', errData.error || response.statusText);
      return { success: false, error: errData.error };
    }

    const resData = await response.json();
    return { success: true, ...resData };
  } catch (error) {
    // Non-blocking catch: email failure will never crash the UI or block form submission
    console.warn('Network error triggering notification email:', error.message);
    return { success: false, error: error.message };
  }
};
