# LM Salon Suite

I’ve reviewed your project brief and your LM Hair Salon black-and-gold logo. The project brief requires an AI-powered productivity solution with at least three core features, effective prompt engineering, and responsible AI practices.

AI Skill Accelerator Programme Project - Copy (3) (1) (1).pdf



Below is a ready-to-use prompt for Lovable to build a professional LM Hair Salon website with an integrated AI assistant, combining your salon branding with the project requirements.

LOVABLE AI PROMPT: LM HAIR SALON WEBSITE AND AI PRODUCTIVITY ASSISTANT

1. Project Overview

Build a modern, responsive, professional website and AI-powered business productivity assistant for LM Hair Salon. The business specializes in hair styling, hair treatments, braiding, cutting, colouring, and other beauty services.

The website must use the uploaded LM Hair Salon logo, featuring elegant gold LM initials, a feminine profile with flowing hair, a black background, and the tagline “STYLE. BEAUTY. CONFIDENCE.”

The application must combine a premium hair salon website with an AI-powered assistant that helps salon staff manage customer communication, appointments, daily tasks, and business information.

2. Design and Branding

Create a luxury beauty brand aesthetic using the following design guidelines:

Primary colours: Black, champagne gold, white, and soft beige.

Style: Elegant, modern, luxurious, clean, and professional.

Typography: Elegant serif headings paired with readable sans-serif body text.

Logo: Use the uploaded LM Hair Salon logo in the navigation bar, homepage, footer, and booking confirmation screen where appropriate.

Images: Use high-quality images of hairstyles, braids, hair treatments, salon interiors, and professional hairstylists.

Layout: Spacious sections, refined gold accents, subtle animations, and elegant cards.

Responsiveness: Ensure the website works properly on mobile phones, tablets, laptops, and desktop computers.

Do not redesign or distort the original logo. Maintain consistent branding throughout the application.

3. Website Pages and Features

A. Home Page

Create an attractive landing page with:

The LM Hair Salon logo and navigation menu.

A large hero section with a beautiful hairstyle photograph.

The heading “Your Beauty, Our Passion.”

The tagline “Style. Beauty. Confidence.”

A short introduction to the salon.

A prominent “Book an Appointment” button.

A “Explore Our Services” button.

Featured hairstyles and popular services.

Customer testimonials.

Business contact information and opening hours.

B. Services and Pricing

Create a services page with professional cards for:

Hair braiding.

Haircuts and styling.

Hair colouring.

Hair treatments.

Wash and blow-dry.

Wig installation and styling.

Special occasion hairstyles.

Each service card should display a description, price, estimated duration, and booking button.

Allow the salon administrator to add, edit, and remove services and update prices. Use clearly marked sample prices until the business owner supplies the actual prices.

C. Online Appointment Booking

Create a functional appointment booking system that allows customers to:

Select a salon service.

Choose an available date and time.

Enter their name, phone number, and email address.

Add special requests.

Review the booking details.

Submit the appointment request.

View a booking confirmation and reference number.

Prevent double-booking by checking existing appointments before confirming availability. Include appointment statuses such as Pending, Confirmed, Completed, and Cancelled.

Provide an appointment management dashboard for salon staff.

D. Customer Contact Page

Include a contact form, salon location, telephone number, email address, opening hours, and social media links.

Use editable placeholder contact information where the business owner's actual details have not been provided.

4. AI-Powered Salon Productivity Assistant

Build a dedicated dashboard called LM Smart Assistant that helps the salon owner and staff save time and manage daily operations.

Implement at least the following four AI-powered features.

Feature 1: AI Customer Email and Message Generator

Allow salon staff to generate professional customer messages for:

Appointment confirmations.

Appointment reminders.

Booking cancellations and rescheduling.

Thank-you messages after appointments.

Promotional offers and new service announcements.

Responses to customer complaints and enquiries.

Include input fields for the customer's situation, message purpose, audience, and preferred tone.

Provide Formal, Friendly, and Persuasive tone options.

Generate editable messages with buttons to copy the result or prepare it for sending. Do not send messages automatically without user approval.

Feature 2: AI Notes Summarizer

Create a tool where the salon owner can paste lengthy notes from staff meetings, customer consultations, or business discussions.

The AI should produce:

A concise summary.

Important discussion points.

Decisions made.

Tasks that need to be completed.

Assigned responsibilities.

Deadlines and follow-up actions.

Display the summary in a clear, organized format and allow the user to copy or save it.

Feature 3: AI Task Planner and Scheduler

Create a daily and weekly planning tool for the salon owner and employees.

Users should be able to enter tasks such as:

Preparing the salon for opening.

Confirming appointments.

Purchasing hair products and supplies.

Cleaning workstations.

Posting marketing content.

Contacting customers.

Managing stock.

Completing end-of-day administration.

The AI should prioritize tasks according to urgency and importance, recommend time slots, identify overdue tasks, and suggest ways to improve productivity.

Allow users to add, edit, complete, and delete tasks. Display tasks in a checklist, calendar, or schedule view.

Feature 4: AI Salon Business Chatbot

Create an interactive chatbot called LM Beauty Assistant.

The chatbot should answer questions about salon services, prices, booking procedures, hair care, appointment preparation, and general salon policies.

It should also help the salon owner with business questions, marketing ideas, customer service messages, and daily planning.

The chatbot must:

Use a friendly, professional tone.

Provide concise and useful answers.

Use actual salon information when available.

Avoid inventing prices, opening hours, availability, or business policies.

Clearly state when information is unavailable.

Allow users to ask follow-up questions.

Display a disclaimer that AI-generated answers may need verification.

5. AI Prompt Engineering

Use structured prompts that include a role, context, task, constraints, and output format.

For example, the customer message generator should use this prompt structure:

“You are a professional customer communication assistant for LM Hair Salon. Generate a clear, polite, and personalized message using the information supplied by the salon staff. Follow the selected tone and communication purpose. Do not invent customer details, appointment times, prices, or promises. Return an editable message with an appropriate greeting and closing. If essential information is missing, ask the user to provide it.”

Apply the same principles to the notes summarizer, task planner, and chatbot. Design prompts to improve accuracy, usefulness, consistency, and professionalism.

6. Admin Dashboard

Create a secure salon administration dashboard with:

Today's appointments.

Upcoming bookings.

Completed and cancelled appointments.

Daily and weekly task lists.

A service and pricing manager.

Customer enquiry management.

Quick access to all AI assistant tools.

Basic appointment statistics.

A simple overview of business activity.

Use charts or summary cards to show appointment counts and service popularity where sufficient data is available.

7. Database and Functionality

Use Supabase for database storage and authentication.

Create suitable database tables for:

User profiles and roles.

Salon services.

Appointments.

Customer enquiries.

Tasks and deadlines.

Saved AI-generated messages.

Meeting notes and summaries.

Implement appropriate validation, error messages, loading indicators, success notifications, and empty states.

Ensure customer information is only accessible to authorized users. Customers should not be able to view other customers' personal details or appointments.

Use secure server-side functions to communicate with the selected AI provider. Store API keys in environment variables or secure secrets, never in frontend code.

If an AI provider is not configured, display a clear setup message rather than pretending that real AI responses are being generated.

8. Responsible AI and Privacy

Follow responsible AI practices throughout the application.

Inform users when content is generated by AI.

Allow users to review and edit AI-generated content before using it.

Do not expose customer personal information unnecessarily.

Validate AI outputs and warn users that incorrect suggestions are possible.

Avoid unsupported claims about hair treatments or guaranteed results.

Do not make bookings or send customer communications without the required confirmation.

Include appropriate privacy information and secure authentication.

Provide a way to correct or delete stored customer information where appropriate.

9. User Experience

Make the application simple enough for a small business owner to use without technical knowledge.

Include:

Clear navigation.

A consistent black-and-gold visual identity.

Accessible text sizes and colour contrast.

Mobile-friendly forms.

Helpful error messages.

Visible booking and task statuses.

Copy-to-clipboard functionality for AI-generated content.

Confirmation dialogs for important actions.

Search and filtering for appointments and tasks.

All buttons and forms must perform their intended functions. Do not create non-functional placeholder buttons or fake AI responses.

10. Technology Requirements

Use the following technology stack where appropriate:

React with TypeScript.

Tailwind CSS for styling.

Supabase for authentication and database storage.

A securely integrated AI API for the assistant features.

Responsive design principles.

Reusable components and clean, maintainable code.

11. Expected Deliverable

Build a working prototype of the LM Hair Salon website and productivity assistant, not just a static design.

The final application must demonstrate:

A professional salon website using the supplied logo.

A service catalogue with editable pricing.

Appointment booking and management.

An AI customer message generator.

An AI notes summarizer.

An AI task planner.

An interactive AI chatbot.

An administrative dashboard.

Secure data handling and responsible AI safeguards.

A responsive interface suitable for mobile and desktop use.

Prioritize the main user journey: customers can discover services and request appointments, while salon staff can manage bookings and use AI tools to reduce repetitive administrative work.

Build the application in a polished, production-minded manner, using realistic sample data only where necessary and clearly identifying anything that still requires configuration.

Start by implementing the complete visual layout and navigation, then build the database-backed booking and management features, followed by the AI tools. Test the main workflows and ensure all implemented features work correctly.

How to use this prompt in Lovable

Open Lovable.

Start a new project.

Upload your LM Hair Salon logo as a project asset.

Copy and paste the full prompt above into Lovable.

Let Lovable generate the initial application, then test each feature and request fixes where necessary.

Configure Supabase and an AI provider when you are ready to enable real database operations and AI-generated responses.

Important: Your project brief requires a practical AI solution, strong prompt engineering, responsible AI, and a demonstration of productivity improvements. The proposed application incorporates these requirements through its four AI tools and salon management workflows.

AI Skill Accelerator Programme Project - Copy (3) (1) (1).pdf

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dace973b-87ae-4978-bf8d-54fe61c98c8e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
