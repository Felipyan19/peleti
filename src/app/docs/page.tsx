"use client";
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
	return (
		<div style={{ height: '100vh'}}>
			<SwaggerUI url="/api/openapi" docExpansion="list" deepLinking />
			<style jsx global>{`
				html, body { margin: 0; background: #fff !important; background-image: none !important; }
				.swagger-ui { background: #fff !important; }
			`}</style>
		</div>
	);
}
