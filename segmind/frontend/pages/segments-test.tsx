import React from 'react'
import Head from 'next/head'

export default function SegmentsPage() {
  const generateEmailWithChatGPT = () => {
    return 'Test email content'
  }

  return (
    <div>
      <Head>
        <title>Customer Segments - Segmind</title>
        <meta name="description" content="Manage and analyze customer segments" />
      </Head>
      <h1>Test Page</h1>
      <p>{generateEmailWithChatGPT()}</p>
    </div>
  )
}