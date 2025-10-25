import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
  segmentName?: string
  productName?: string
}

export default function CampaignModal({ isOpen, onClose, segmentName, productName }: CampaignModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // Navigate to campaign creation page instead of showing modal
      const params = new URLSearchParams()
      if (segmentName) params.set('segment', segmentName)
      if (productName) params.set('product', productName)

      router.push(`/campaign/create?${params.toString()}`)
      onClose()
    }
  }, [isOpen, router, segmentName, productName, onClose])

  return null
}