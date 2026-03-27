# Toplax Website Development Plan

*(Aligned with the instructor's voice instructions)*

------------------------------------------------------------------------

# 1. Project Goal

The goal of this project is to **modify the Toplax Factory & Industry
HTML template** to create a company website.

Important constraints from the voice instructions:

-   Use the **existing theme** that was provided.
-   Do **not redesign the UI from scratch**.
-   Modify and rename existing pages.
-   Focus on the **main company information, products, announcements,
    and contact system**.
-   Follow the **yellow branding color**.

Future systems like **Oil Advisor and Branch Locator** were mentioned
but **are not required for the initial version**.

------------------------------------------------------------------------

# 2. Confirmed Requirements From Voice Recording

From the transcript, the instructor clearly mentioned:

Required pages:

-   Home
-   About Us
-   Products (formerly Services)
-   News / Announcements (formerly Blog)
-   Contact Us

Important instructions:

-   The theme should use **yellow branding**.
-   News should support **photos and videos**.
-   Contact form must **send email automatically**.
-   The website should use the **existing template structure**.
-   Future features (not required yet):
    -   Branch locator
    -   Oil advisor system

------------------------------------------------------------------------

# 3. Template File Mapping

Original template files:

    index.html
    about.html
    services.html
    blog.html
    blog-single.html
    contact.html

Rename and modify:

    index.html → Home
    about.html → About Us
    services.html → Products
    blog.html → News
    blog-single.html → News Article
    contact.html → Contact

Navigation menu should be:

    Home
    About Us
    Products
    News
    Contact

------------------------------------------------------------------------

# 4. Website Page Plan

## Home Page

Purpose: Introduce the company and highlight products and announcements.

Sections:

-   Hero banner
-   Company introduction
-   Featured products
-   Latest news preview
-   Call-to-action
-   Footer

Reuse components from the template:

-   Hero section
-   Service cards → converted to product cards
-   Blog preview → converted to news preview

------------------------------------------------------------------------

## About Us Page

Purpose: Provide company information.

Content:

-   Company background
-   Mission and vision
-   Company history
-   Brand story

Reuse template sections such as:

-   Image and text blocks
-   Statistics section

------------------------------------------------------------------------

## Products Page

This page replaces the **Services page**.

Layout:

Product grid displaying oil or lubricant products.

Each product card should contain:

-   Product image
-   Product name
-   Brand
-   Short description

Example products:

-   Motul 5100
-   Shell Advance
-   Castrol Power1
-   Yamalube

Optional improvement:

-   Individual product detail pages.

------------------------------------------------------------------------

## News / Announcements Page

This page replaces the **Blog page**.

Purpose:

-   Announcements
-   Events
-   Company updates
-   Product launches

Features:

-   News listing page
-   Individual news article page
-   Support for photos
-   Support for video embeds

Example news topics:

-   New oil product launch
-   Motorcycle event participation
-   Maintenance tips

------------------------------------------------------------------------

## Contact Page

Contact form fields:

-   Name
-   Email
-   Phone
-   Message

Behavior when submitted:

1.  Form sends message to the server.
2.  The server sends an email notification to the company.
3.  The user's email application should **not open manually**.

Implementation options:

-   PHP mail()
-   Node.js email service
-   SMTP service

------------------------------------------------------------------------

# 5. Branding and Design

From the voice recording:

> "Dilaw po tayo" (We use yellow branding)

Suggested color palette:

Primary Color:

    #FFC107

Supporting colors:

    Dark: #1A1A1A
    Light: #F9F9F9
    Accent: #FF8F00

Usage:

-   Yellow for buttons and highlights
-   Dark for navigation and footer
-   White for background

------------------------------------------------------------------------

# 6. Project Folder Structure

Recommended organization:

    /toplax-project

    index.html
    about.html
    products.html
    news.html
    news-single.html
    contact.html

    /css
    /js
    /images
    /products
    /news

------------------------------------------------------------------------

# 7. Media Support

News articles should support:

-   Image gallery
-   Video embed

Recommended approach:

-   Upload images to `/images/news/`
-   Use embedded video links (YouTube)

------------------------------------------------------------------------

# 8. Contact Email Flow

Contact form submission flow:

    User submits form
          ↓
    Server receives request
          ↓
    Server sends email to admin
          ↓
    Confirmation message shown to user

Important requirement from instructor:

The form must **send email automatically** without opening Gmail.

------------------------------------------------------------------------

# 9. Development Steps

## Step 1

Extract the Toplax template.

## Step 2

Remove unnecessary pages.

## Step 3

Rename template pages according to the project structure.

## Step 4

Modify the navigation menu.

## Step 5

Convert the Services section into Products.

## Step 6

Convert the Blog section into News.

## Step 7

Add product and news content.

## Step 8

Implement the contact form email system.

## Step 9

Update theme colors to match the yellow branding.

## Step 10

Test responsiveness and functionality.

------------------------------------------------------------------------

# 10. Future Features (Mentioned but Not Required)

The instructor mentioned possible future features:

-   Branch locator system
-   Oil advisor recommendation system
-   Product comparison logic

These should **not be implemented in the current version** but the site
should be structured so they can be added later.

------------------------------------------------------------------------

# 11. Final Deliverable

The completed project should include:

-   Corporate website using the Toplax theme
-   Product catalog
-   News / announcement system
-   Contact form with email functionality
-   Photo and video support
-   Yellow brand styling
-   Responsive design
