import { ExchangeResponse } from '@/types/Exchange';
import styles from './ExchangeItemUI.module.scss';
import { ReactNode } from 'react';
import { miniIcons } from '@/assets/images/miniIcons';
import { AnyBookCard } from '../../bookCards/AnyBookCard/AnyBookCard';
import { BookOfferCard } from '../../bookCards/BookOfferCard/BookOfferCard';

interface ExchangeItemUIProps {
  exchange: ExchangeResponse;
  actionSection: ReactNode;
}

export const ExchangeItemUI: React.FC<ExchangeItemUIProps> = ({
  exchange,
  actionSection,
}) => {
  const initiatorBook = exchange.initiatorBook;
  const recipientBook = exchange.recipientBook;
  const isAnyBookOffered = exchange.isAnyBookOffered;

  return (
    <div className={styles.exchange__pairContainer}>
      <div className={styles.exchange__pair}>
        <div className={styles.itemContainer}>
          {isAnyBookOffered ? (
            <AnyBookCard book={{ text: 'Будь-яка з книжок юзера' }} hasLogic={false} />
          ) : (
            <BookOfferCard book={initiatorBook} />
          )}
        </div>
        <img className={styles.arrowsIcon} src={miniIcons.arrows} alt="arrowsIcon" />
        <div className={styles.itemContainer}>
          <BookOfferCard book={recipientBook} />
        </div>
      </div>
      {actionSection}
    </div>
  );
};
