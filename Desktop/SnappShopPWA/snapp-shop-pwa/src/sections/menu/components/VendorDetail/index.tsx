import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import VendorDetailHeader from './Header'
import {VendorDetailComments} from './Comments'
import {VendorDetailScores} from './Scores'
import {rem} from 'polished'
import {VendorModel} from '@schema/vendor'
import {CommentsSort} from '~menu/types/index'
import {VendorState} from '~menu/redux/vendor'
import {FlexBox, Modal} from '@sf/design-system'
import {useScrollEnd} from '@hooks/useScrollEnd'

interface Props {
  isOpen: boolean
  vendorModel: VendorModel
  vendorComments: VendorState['vendorComments']
  getMoreComments: () => void
  onSort: (sort: CommentsSort['params'][number]) => void
  handleClose: (...args: unknown[]) => void
}

const ShiftCard = styled(FlexBox)`
  width: ${rem(720)};
`
const Wrapper = styled.section`
  height: calc(90vh - 16rem);
  overflow-y: auto;
`

export const VendorDetail: React.FC<Props> = ({
  isOpen,
  vendorModel,
  vendorComments,
  getMoreComments = () => {},
  onSort = () => {},
  handleClose = () => {},
}) => {
  const vendor = vendorModel.vendor || {}
  const containerRef = useRef<HTMLDivElement>(null)
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [isEnd, setIsEnd] = useScrollEnd({
    threshold: 0.9,
    node: node,
  })

  function closeDetailsModal() {
    if (isMapModalOpen) return
    handleClose()
  }

  useEffect(() => {
    setNode(containerRef.current)
  }, [containerRef.current, isOpen])

  useEffect(() => {
    setIsEnd(false)
  }, [vendorComments.comments])

  useEffect(() => {
    if (isEnd) {
      getMoreComments()
    }
  }, [isEnd])

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeDetailsModal}
      animation='slideUp'
      backdropColor='var(--modal-backdrop)'
    >
      <ShiftCard direction='column'>
        <VendorDetailHeader
          handleClose={closeDetailsModal}
          vendorModel={vendorModel}
          isMapModalOpen={isMapModalOpen}
          setIsMapModalOpen={setIsMapModalOpen}
          shifts={vendor.sortedSchedules}
        />
        <Wrapper ref={containerRef}>
          <VendorDetailScores vendorModel={vendorModel} />
          <VendorDetailComments
            vendorComments={vendorComments}
            vendorType={vendor.newTypeTitle}
            onSort={onSort}
          />
        </Wrapper>
      </ShiftCard>
    </Modal>
  )
}
