import '@/app/styles/Card.css';
import { Address } from 'viem';
import { Button } from './Button';

export function Card(props: {
  message: string;
  creator: Address;
  timestamp: number;
  claps: number;
  isSpam: boolean;
  currentAddress: Address;
  contractOwner: Address;
  disableClap: boolean;
  messageId: number;
  handleClap: (messageId: number) => Promise<void>;
  handleSpamToggle: (
    messageId: number,
    action: 'mark' | 'unmark'
  ) => Promise<void>;
}) {
  const {
    message,
    creator,
    timestamp,
    claps,
    isSpam,
    currentAddress,
    contractOwner,
    disableClap,
    handleClap,
    messageId,
    handleSpamToggle,
  } = props;

  const spamDivClass = isSpam === true ? 'show' : 'hide';
  return (
    <>
      <div className="card">
        <div className="body">
          <div className="body-text">
            {' '}
            {message} - {formatAddress(creator)}
          </div>

          <div className="details">
            <div className="claps">Claps: {claps}</div>
            <div className={spamDivClass}>Spam! ⛔</div>
            <div className="date">{formatDate(timestamp)}</div>
          </div>
        </div>

        <div className="action">
          <Button
            contractOwner={contractOwner}
            creator={creator}
            currentAddress={currentAddress}
            isSpam={isSpam}
            messageId={messageId}
            disableClap={disableClap}
            handleClap={handleClap}
            handleSpamToggle={handleSpamToggle}
          />
        </div>
      </div>
    </>
  );
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return Intl.DateTimeFormat('en-US').format(date);
}

function formatAddress(address: Address) {
  return address.substring(0, 4) + '...' + address.substring(38, 42);
}
