# n8n-nodes-shopware

This is an n8n community node package. It allows you to use the complete Shopware Admin API in n8n.

In addition, you can use all Shopware webhooks as triggers in n8n and manage the required Shopware credentials centrally in n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n documentation.

Package name:

```bash
@c0d3bl1ck/n8n-nodes-shopware
```

## Operations

This package includes two nodes:

1. **Shopware (Admin Node)**

- Access to the Shopware Admin API based on the OpenAPI specification.
- Support for a wide range of Admin API resources and operations.
- **Custom API Call** for arbitrary endpoints, HTTP methods, and request bodies.

2. **Shopware Trigger**

- Registration and usage of Shopware webhooks directly as n8n triggers.
- Freely configurable `Event Name` (Shopware webhook event).
- `Only Live Version` option to control the event source.

## Credentials

Both nodes use the **Shopware Admin Credentials API** credential type.

Required fields:

- **URL**: Base URL of your Shopware instance (API endpoint)
- **Client ID**
- **Client Secret**

Authentication uses OAuth2 with `client_credentials` against `/<your-url>/oauth/token`.

Prerequisite in Shopware:

- Create an integration in the Shopware system settings.
- Enter the generated `Client ID` and `Client Secret` in n8n.

## Compatibility

- Node.js: `>= 18.10`
- pnpm: `>= 9.1`
- n8n: Community nodes with `n8nNodesApiVersion: 1`

Note: Validate with your target n8n and Shopware versions, especially when Shopware API changes are involved.

## Usage

Typical workflow:

1. Create a new credential of type **Shopware Admin Credentials API** in n8n.
2. Use the **Shopware** node for Admin API actions or a **Custom API Call**.
3. Use the **Shopware Trigger** node to consume Shopware webhook events as workflow triggers.

Example scenarios:

- Read and process products, orders, or customers via the Admin API.
- Use Shopware events (for example, entity changes) as starting points for automations.
- Implement API calls that are not yet exposed as predefined operations in the node via **Custom API Call**.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Shopware developer documentation](https://developer.shopware.com/docs)
- [Shopware webhook events reference](https://developer.shopware.com/docs/resources/references/app-reference/webhook-events-reference.html)

## Version history

- **0.1.x**: Initial release including
- Shopware Admin API node
- Shopware Trigger node for webhooks
- Shopware credential management in n8n
