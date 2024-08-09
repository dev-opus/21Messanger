import { Address } from 'viem';

export function Button(props: {
  creator: Address;
  currentAddress: Address;
  contractOwner: Address;
  isSpam: boolean;
  disableClap: boolean;
  messageId: number;
  handleClap: (messageId: number) => Promise<void>;
  handleSpamToggle: (
    messageId: number,
    action: 'mark' | 'unmark'
  ) => Promise<void>;
}) {
  const {
    contractOwner,
    creator,
    messageId,
    currentAddress,
    isSpam,
    disableClap,
    handleClap,
    handleSpamToggle,
  } = props;

  const spamAction = isSpam ? 'unmark' : 'mark';

  if (contractOwner === currentAddress) {
    return (
      <>
        <button
          disabled={disableClap}
          onClick={async () => await handleSpamToggle(messageId, spamAction)}
        >
          {isSpam ? 'Mark as not spam' : 'Mark as spam'}
        </button>
      </>
    );
  }

  if (creator === currentAddress) {
    return (
      <>
        <button disabled> Clap </button>
      </>
    );
  }

  return (
    <>
      <button
        disabled={disableClap}
        onClick={async () => await handleClap(messageId)}
      >
        Clap
      </button>
    </>
  );
}
