const { ethers } = require('ethers');
const colors = require('colors');
const fs = require('fs');
const readlineSync = require('readline-sync');
const sleep = require('./src/sleep');

const checkBalance = require('./src/checkBalance');
const displayHeader = require('./src/displayHeader');

const rpcUrl = fs.readFileSync('rpc.txt', 'utf8').trim();

const main = async () => {
  displayHeader();

  const privateKeys = JSON.parse(fs.readFileSync('privateKeys.json'));

  // Meminta jumlah transaksi yang akan dieksekusi untuk semua wallet
  let transactionCount = readlineSync.questionInt(
    'Enter the number of transactions you want to send for each wallet: '
  );

  console.log();

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  for (const privateKey of privateKeys) {
    const wallet = new ethers.Wallet(privateKey, provider);
    const senderAddress = wallet.address;

    console.log(
      colors.cyan(`Processing transactions for address: ${senderAddress}`)
    );

    let senderBalance = await checkBalance(provider, senderAddress);

    if (senderBalance < ethers.parseUnits('0.01', 'ether')) {
      console.log(colors.red('BOT stopped. Insufficient or zero balance.'));
      continue;
    }

    let continuePrintingBalance = true;
    const printSenderBalance = async () => {
      while (continuePrintingBalance) {
        senderBalance = await checkBalance(provider, senderAddress);
        console.log(
          colors.blue(
            `Current Balance: ${ethers.formatUnits(senderBalance, 'ether')} ETH`
          )
        );
        if (senderBalance < ethers.parseUnits('0.01', 'ether')) {
          console.log(colors.red('Insufficient balance for transactions.'));
          continuePrintingBalance = false;
        }
        await sleep(5000);
      }
    };

    printSenderBalance();

    for (let i = 1; i <= transactionCount; i++) {
      const receiverWallet = ethers.Wallet.createRandom();
      const receiverAddress = receiverWallet.address;
      console.log(colors.white(`\nGenerated address ${i}: ${receiverAddress}`));

      const amountToSend = ethers.parseUnits(
        (Math.random() * (0.0001 - 0.00001) + 0.00001).toFixed(8).toString(),
        'ether'
      );

      // Set gas price to 20 Gwei (adjust as needed based on network conditions)
      const gasPrice = ethers.parseUnits(
        (Math.random() * (15 - 9) + 9).toFixed(2).toString(),
        'gwei'
      );

      const transaction = {
        to: receiverAddress,
        value: amountToSend,
        gasLimit: 21000,
        gasPrice: gasPrice,
        chainId: 11155111,
      };

      try {
        const tx = await wallet.sendTransaction(transaction);

        console.log(colors.white(`Transaction ${i}:`));
        console.log(colors.white(`  Hash: ${colors.green(tx.hash)}`));
        console.log(colors.white(`  From: ${colors.green(senderAddress)}`));
        console.log(colors.white(`  To: ${colors.green(receiverAddress)}`));
        console.log(
          colors.white(
            `  Amount: ${colors.green(
              ethers.formatUnits(amountToSend, 'ether')
            )} ETH`
          )
        );
        console.log(
          colors.white(
            `  Gas Price: ${colors.green(
              ethers.formatUnits(gasPrice, 'gwei')
            )} Gwei`
          )
        );

        await sleep(15000);

        let receipt;
        for (let retryCount = 0; retryCount < 5; retryCount++) {
          try {
            receipt = await provider.getTransactionReceipt(tx.hash);
            if (receipt) {
              if (receipt.status === 1) {
                console.log(colors.green('Transaction Success!'));
                console.log(
                  colors.green(`  Block Number: ${receipt.blockNumber}`)
                );
                console.log(
                  colors.green(`  Gas Used: ${receipt.gasUsed.toString()}`)
                );
              } else {
                console.log(colors.red('Transaction FAILED'));
              }
              break;
            } else {
              console.log(
                colors.yellow('Transaction is still pending. Retrying...')
              );
              await sleep(10000);
            }
          } catch (e) {
            console.log(
              colors.red(`Error checking transaction status: ${e.message}`)
            );
            await sleep(10000);
          }
        }
      } catch (error) {
        console.log(colors.red(`Error sending transaction: ${error.message}`));
      }

      console.log();
    }

    console.log(
      colors.green(`Finished transactions for address: ${senderAddress}`)
    );
  }

  console.log(colors.green('All operations completed. Exiting script.'));
  process.exit(0);
};

main();
