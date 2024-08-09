import hre from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe('MessageBoard', () => {
  const deployFixture = async () => {
    const messageBoard = await hre.ethers.deployContract('MessageBoard');
    await messageBoard.waitForDeployment();

    const [owner, acc1, acc2] = await hre.ethers.getSigners();

    return { messageBoard, owner, acc1, acc2 };
  };

  it('should deploy the contract and set the owner correctly', async () => {
    const { messageBoard, owner } = await loadFixture(deployFixture);

    expect(await messageBoard.owner()).to.eq(owner.address);
  });

  it('should create messages correctly', async () => {
    const { messageBoard, acc1 } = await loadFixture(deployFixture);
    const msgText = 'this should work';

    await messageBoard.connect(acc1).create(msgText);
    const [msg] = await messageBoard.get();

    expect(msg.creator).to.eq(acc1.address);
    expect(msg.text).to.eq(msgText);
    expect(msg.messageId).to.eq(0);
  });

  it('should clap for a message correctly', async () => {
    const { messageBoard, acc1, acc2 } = await loadFixture(deployFixture);
    const msgText = 'this should work';

    await messageBoard.connect(acc1).create(msgText);
    const [msg] = await messageBoard.get();

    await messageBoard.connect(acc2).clap(msg.messageId, 1);
    const [clappedMsg] = await messageBoard.get();

    expect(clappedMsg.claps).to.eq(1);
  });

  it('should mark a message as spam correctly', async () => {
    const { messageBoard, owner, acc1 } = await loadFixture(deployFixture);
    const msgText = 'this should work';

    await messageBoard.connect(acc1).create(msgText);
    const [msg] = await messageBoard.get();

    await messageBoard.connect(owner).markAsSpam(msg.messageId);
    const [spamMsg] = await messageBoard.get();

    expect(spamMsg.isSpam).to.eq(true);
  });

  it('should unmark a message previously marked as spam correctly', async () => {
    const { messageBoard, owner, acc1 } = await loadFixture(deployFixture);
    const msgText = 'this should work';

    await messageBoard.connect(acc1).create(msgText);
    const [msg] = await messageBoard.get();

    await messageBoard.connect(owner).markAsSpam(msg.messageId);
    const [spamMsg] = await messageBoard.get();

    await messageBoard.connect(owner).unMarkAsSpam(msg.messageId);
    const [nonSpamMsg] = await messageBoard.get();

    expect(spamMsg.isSpam).to.eq(true);
    expect(nonSpamMsg.isSpam).to.eq(false);
  });
});
