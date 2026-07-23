---
id: project-01
slug: whatsapp-lead-alert-ai-analyst-bot
title: WhatsApp Lead Alert & AI Data Analyst Bot
company:
  name: Confidential
  disclose_name: false
summary: >
  Built an internal WhatsApp-based lead monitoring and AI analytics system for a
  fintech business, combining scheduled CRM alerts, anomaly detection,
  natural-language-to-SQL querying, chart generation, and automated reporting.
featured: true
status: published
visibility: public
year: 2025
categories:
  - AI Agent
  - Data Analytics
  - Automation
  - CRM Operations
technologies:
  - Python
  - FastAPI
  - Pandas
  - SQLAlchemy
  - PostgreSQL
  - Matplotlib
  - OpenRouter
  - Google Gemini
  - Google Sheets API
  - Node.js
  - Express
  - whatsapp-web.js
deployment:
  - Self-hosted Python backend service
  - Node.js WhatsApp bridge with headless browser session
  - PostgreSQL CRM/local analytics databases
  - Google Sheets reporting and audit logging
metrics:
  - Hourly lead anomaly detection against historical averages
  - 15-minute untouched-lead SLA scans during working hours
  - 30-minute high-value lead scans and targeted team alerts
  - Daily eligibility, contactability, and funnel-health reporting
  - Read-only AI-generated SQL execution with provider failover
confidentiality:
  hide_internal_urls: true
  hide_source_code: true
  hide_customer_data: true
  anonymize_metrics: true
---

## Problem

Sales and operations teams needed faster visibility into CRM lead issues, high-intent opportunities, and follow-up gaps. Important signals were spread across CRM tables, manual checks, and ad hoc analysis, which made it easy to miss lead spikes, lead drops, untouched leads, incomplete action logs, uncontacted customers, and unfinished mediation tickets.

The business also needed non-technical stakeholders to ask operational and revenue questions without writing SQL, while still keeping database access controlled and read-only.

## Role

Owned the end-to-end design and implementation of the internal alerting and analytics bot, including:

- Designing the WhatsApp-first operational workflow for managers, team leaders, and analysts.
- Building the Python backend for scheduled checks, data processing, reporting, and command handling.
- Implementing SQL-based CRM monitoring logic for leads, actions, eligibility, revenue, and tickets.
- Creating AI agents for text-to-SQL, narrative reporting, chart selection, and conversational analytics.
- Integrating multiple LLM providers with model switching and failover behavior.
- Building the Node.js WhatsApp bridge used to receive commands and send messages, charts, and Excel/CSV reports.
- Adding Google Sheets logging/reporting for AI usage and lead assessment outputs.
- Applying access controls so sensitive reports and AI analytics are limited to authorized chats/users.

## Architecture

The system is split into two main services:

1. **Python analytics backend**
   - FastAPI receives WhatsApp command webhooks.
   - An asyncio scheduler runs recurring operational checks.
   - SQLAlchemy connects to CRM and local PostgreSQL databases.
   - Pandas performs transformations, anomaly checks, funnel calculations, and report preparation.
   - Matplotlib generates chart images.
   - Google Sheets integration logs AI usage and publishes lead assessment data.

2. **Node.js WhatsApp bridge**
   - Express exposes local endpoints for sending text, images, and documents.
   - whatsapp-web.js connects to WhatsApp Web using a persistent local session.
   - Incoming slash commands, replies, and bot mentions are forwarded to the Python webhook.
   - The bridge supports sending WhatsApp messages, PNG charts, and Excel documents.

The AI layer uses dedicated prompt agents for:

- Natural-language-to-SQL generation.
- Data-to-report summarization.
- Chart specification generation.
- Conversational data analysis.

A router selects the primary AI provider and falls back to a secondary provider when needed.

## Implementation

Key capabilities implemented in the codebase include:

- **Lead anomaly detection:** compares today’s cumulative hourly lead volume by source against historical averages and flags major drops or spikes.
- **Untouched lead monitoring:** finds open leads with no action after 60 minutes and routes detailed alerts to relevant team leaders.
- **High-potential lead detection:** parses CRM note parameters, extracts debt-related values, identifies high-value cases, and sends team-specific alerts.
- **Virtual consultant lead parsing:** extracts call time, debt summary, alternate WhatsApp numbers, domicile, and other details from structured/unstructured lead notes.
- **Eligibility and contactability reporting:** classifies leads as contacted, uncontacted, never connected, eligible, or not eligible, then compares current-month performance against six-month historical averages.
- **Missing action-result reporting:** identifies cases with actions or status movement but missing logged outcomes, then sends Excel files and summaries.
- **Unfinished mediation ticket tracking:** summarizes open mediation tickets and sends detailed Excel exports to the responsible team.
- **Lead assessment reporting:** calculates rolling lead funnel, contacted rate, eligible rate, and success rate, then syncs raw data to Google Sheets.
- **AI analyst commands:** supports plain-language questions through `/ask_agent`, with optional chart, CSV, and Excel outputs.
- **Security controls:** restricts AI and operational commands to configured WhatsApp IDs and only executes AI-generated SQL that starts with `SELECT` or `WITH`.

## Results

The project delivered a practical internal operations assistant that turned WhatsApp into a real-time analytics and alerting interface.

Public-safe outcomes:

- Reduced dependence on manual CRM checking by automating recurring lead, SLA, and ticket monitoring.
- Helped team leaders receive targeted alerts for their own teams instead of broad, noisy reports.
- Enabled non-technical stakeholders to ask business questions in natural language and receive summaries, charts, or exports.
- Improved operational visibility into lead quality, contact performance, eligibility movement, and unresolved workflow gaps.
- Added auditability for AI analytics usage through Google Sheets logging.
