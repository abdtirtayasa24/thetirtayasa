---
id: project-02
slug: whatsapp-ai-agent-human-handoff
title: WhatsApp AI Intake Agent & Human Handoff Dashboard
company:
  name: Confidential
  disclose_name: false
summary: >
  Built a WhatsApp Business chatbot and operator dashboard for a fintech
  service provider, combining Gemini-powered intake conversations, structured
  lead qualification, multimodal document handling, realtime human handoff,
  CRM synchronization, and operational analytics.
featured: true
status: published
visibility: public
year: 2025
categories:
  - AI Agent
  - Customer Support Automation
  - CRM Automation
  - Realtime Dashboard
technologies:
  - Python
  - FastAPI
  - Uvicorn
  - Socket.IO
  - Firebase Realtime Database
  - Google Vertex AI
  - Gemini
  - WhatsApp Business Platform
  - Meta Graph API
  - Google Cloud Pub/Sub
  - Google Sheets
  - Docker
  - Google Cloud Run
  - Cloud Build
  - JWT
  - bcrypt
  - HTML
  - CSS
  - Vanilla JavaScript
deployment:
  - Dockerized FastAPI application deployed on Google Cloud Run
  - Cloud Build pipeline for container build, push, and service update
  - Firebase Realtime Database for chat state, messages, leads, agents, and session history
  - Google Cloud Pub/Sub integration for downstream CRM handoff
metrics:
  - Tracks message volume, AI responses, human-agent responses, active chats, and token usage
  - Supports CSV exports for leads, chat transcripts, token usage, and follow-up tracking
  - Includes privacy-conscious transcript export tooling for pseudonymized evaluation datasets
confidentiality:
  hide_internal_urls: true
  hide_source_code: true
  hide_customer_data: true
  anonymize_metrics: true
---

## Problem
The business needed to handle high-volume WhatsApp inquiries from potential customers seeking debt-management assistance. Manual chat handling made it difficult to respond quickly, qualify leads consistently, collect debt details, review images or PDF billing evidence, and hand conversations over to consultants without losing context.

The team also needed an internal dashboard for live monitoring, agent takeover, lead review, token/cost visibility, CSV exports, and CRM synchronization while protecting sensitive customer data.

## Role
Owned the full-stack implementation of the WhatsApp AI support system, including:

- Backend architecture using FastAPI, Socket.IO, and Firebase Realtime Database.
- WhatsApp Business webhook handling and Meta Graph API message delivery.
- Gemini / Vertex AI conversation orchestration, prompt management, and session persistence.
- Structured lead extraction from AI responses into database-ready records.
- Human-agent dashboard features including login, chat monitoring, unread state, manual takeover, and outbound replies.
- CRM handoff through Google Cloud Pub/Sub.
- Operational analytics, token usage reporting, and CSV export endpoints.
- Docker and Cloud Run deployment configuration.
- Data export tools for pseudonymized transcript analysis and cold-storage archival.

## Architecture
The system uses a WhatsApp-first, human-in-the-loop architecture.

Incoming WhatsApp messages are received through a FastAPI webhook, stored in Firebase Realtime Database, and broadcast to the dashboard through Socket.IO. Text, image, and PDF messages are buffered briefly so multi-message customer inputs can be processed together before being sent to Gemini on Vertex AI.

When a conversation is in AI mode, the backend restores or creates a persisted Gemini chat session, injects time and verification context, sends the multimodal prompt, extracts structured lead data from the model response, saves the clean customer-facing reply, and sends it back through the WhatsApp Graph API.

When a conversation is switched to human mode, agents can take over from the dashboard. Their replies are sent through WhatsApp, stored in the same conversation history, and preserved so future AI interactions retain context.

Background jobs handle lead synchronization to CRM, personalized follow-ups, chat-session cleanup, prompt-cache refresh, and live agent-removal notifications.

## Implementation
Key implementation details include:

- WhatsApp webhook verification and message routing for text, image, PDF, button, and unsupported media types.
- Realtime dashboard built with HTML, CSS, vanilla JavaScript, Socket.IO, Axios, and Chart.js.
- JWT-based agent authentication with bcrypt password hashing.
- Firebase-backed data model for agents, messages, chat states, leads, and AI session history.
- AI/human mode switching with assigned-agent tracking and unread message counts.
- Gemini prompt caching and runtime system-prompt upload with cache invalidation.
- Multimodal input preparation for image and PDF debt-detail analysis.
- Structured lead extraction from model-generated JSON blocks.
- Consultant phone verification using Google Sheets data.
- CRM payload mapping with debt lender, outstanding amount, contact, lead type, result, rating, and notes.
- Automated follow-up generation using conversation context and Jakarta-time business rules.
- CSV exports for operational review and reporting.
- Separate tooling for pseudonymized transcript exports and full-fidelity database archive exports.

## Results
The project delivered an operational WhatsApp AI assistant with live human handoff, allowing the business to qualify leads, collect structured debt information, monitor conversations, and synchronize eligible leads to CRM from one dashboard.

It also improved operational visibility through realtime chat monitoring, AI/human response counts, token usage tracking, exportable reports, and archival tooling for migration or decommissioning workflows.
