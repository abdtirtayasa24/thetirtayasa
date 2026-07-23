---
id: project-03
slug: ai-qc-checker
title: AI-Powered Quality Control Checker
company:
  name: Confidential
  disclose_name: false
summary: >
  Automated quality-control system that uses AI to evaluate customer calls and
  WhatsApp chat transcripts against SOP, KYC, response-time, product-explanation,
  and fraud-detection rules, then logs structured results into Google Sheets with
  email and Excel reporting.
featured: true
status: published
visibility: public
year: 2026
categories:
  - AI Agent
  - Automation
  - Data Integration
  - Quality Assurance
technologies:
  - Python
  - Google Vertex AI
  - Gemini 2.5 Flash
  - Google Sheets API
  - Google Cloud Storage
  - PostgreSQL
  - SQLAlchemy
  - Pandas
  - Paramiko / SFTP
  - Pydub
  - OpenPyXL
  - SMTP Email
deployment:
  - Scheduled Python scripts
  - Windows Task Scheduler
  - Google Cloud service account integration
  - Environment-variable based configuration
metrics:
  - Daily automated QC workflow for both call recordings and WhatsApp chat transcripts
  - Structured evaluation across 6 SOP/QC criteria, 9 KYC checks, and fraud-detection rules
  - Supports batch chat QC runs up to 300 rows per execution
  - Uses 50-row Google Sheets batch writes and retry/backoff handling for quota resilience
  - Compresses call audio to 8kbps for more efficient AI analysis
confidentiality:
  hide_internal_urls: true
  hide_source_code: true
  hide_customer_data: true
  anonymize_metrics: true
---

## Problem

Manual quality control for customer conversations was time-consuming, inconsistent, and difficult to scale across both voice calls and WhatsApp chats. The business needed a repeatable way to evaluate agent SOP compliance, response quality, payment-transfer safety, KYC completeness, and potential fraud signals without exposing customer data or relying entirely on manual review.

## Role

Designed and implemented the end-to-end automation, including the chat and call QC pipelines, AI prompts, structured response schemas, CRM and cloud-storage integrations, SFTP audio ingestion, Google Sheets reporting, email notifications, retry handling, logging, and scheduled execution setup.

## Architecture

The system is a Python-based batch automation pipeline with two main entrypoints:

- `chat_checker.py` for WhatsApp chat quality control
- `call_checker.py` for call-recording quality control

Core logic lives in `app.py`, split into:

- `ChatQCChecker`
- `CallQCChecker`

The chat pipeline pulls paid case samples from a PostgreSQL CRM database, downloads chat exports from Google Cloud Storage, parses WhatsApp `.txt` or `.zip` transcripts, evaluates them with Gemini on Vertex AI, and writes QC results to Google Sheets.

The call pipeline connects to SFTP recording servers, downloads and filters audio files, extracts metadata from filenames, optionally compresses audio, sends recordings to Gemini on Vertex AI, and writes structured call analysis into a Google Sheet report.

Both pipelines include logging, idempotency checks, quota-aware retries, batch writes, email summaries, and Excel backup exports.

## Implementation

Key implementation details include:

- Google Vertex AI integration using Gemini 2.5 Flash with strict JSON response schemas.
- Separate prompt files for call and chat evaluation rules.
- WhatsApp transcript parser supporting multiple timestamp/export formats.
- Smart chat truncation that preserves greetings, closing messages, payment keywords, and KYC-related sections.
- PostgreSQL sampling query for selecting eligible paid chat cases.
- Google Cloud Storage downloader for chat export files.
- SFTP downloader for call recordings with support for multiple folder structures.
- Agent-extension mapping through Google Sheets.
- Call metadata extraction from recording filenames.
- Audio duration and bitrate detection with optional 8kbps compression.
- Batch Google Sheets writes with exponential backoff for quota/rate-limit errors.
- Daily log rotation, Excel report generation, and HTML email status summaries.

## Results

The project converted a manual QC workflow into a repeatable AI-assisted review system. It standardized how calls and chats are evaluated, centralized results in Google Sheets, added automated reporting, improved operational traceability, and introduced safeguards for fraud/payment-account detection and SOP compliance review.
