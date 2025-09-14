"use client";
import SwaggerUIWrapper from '../../components/SwaggerUIWrapper';

export default function ApiDocsPage() {
	return <SwaggerUIWrapper url="/api/openapi" docExpansion="list" deepLinking />;
}
