import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  TransactionInstruction,
  Transaction,
  Keypair
} from "@solana/web3.js";
import idl from './bangmaps_contracts.json';
import { BangmapsContracts as BangmapsIdl } from "./bangmaps_contracts";

export class BangmapsClient {
  public readonly connection: Connection;
  public readonly wallet: Wallet;
  public readonly program: Program<BangmapsIdl>;
  public readonly provider: AnchorProvider;

  constructor(
    wallet: Wallet, 
    connection: Connection, 
  ) {
    this.wallet = wallet;
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    this.program = new Program(idl as BangmapsIdl, this.provider);
  }

  /**
   * Find the state PDA for the program
   */
  getStatePDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      this.program.programId
    );
  }

  /**
   * Find the vault PDA for the program
   * @param statePDA The state PDA
   */
  getVaultPDA(statePDA: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), statePDA.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Find the contributor PDA for a specific user
   * @param statePDA The state PDA
   * @param userPubkey The user's public key
   */
  getContributorPDA(statePDA: PublicKey, userPubkey: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("contributor"), statePDA.toBuffer(), userPubkey.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Initialize the Bangmaps program
   * @param admin The public key that will be set as admin
   * @param options Optional transaction options
   * @returns Transaction signature
   */
  async initialize(
    admin: PublicKey,
  ): Promise<string> {
    const adminSigner = this.wallet.publicKey;
    const [statePDA] = this.getStatePDA();
    const [vaultPDA] = this.getVaultPDA(statePDA);

    const tx = await this.program.methods
      .initialize(admin)
      .accountsStrict({
        state: statePDA,
        vault: vaultPDA,
        adminSigner: adminSigner,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return await this.provider.sendAndConfirm(tx, []);
  }

  /**
   * Pay for a search operation
   * @returns Transaction signature
   */
  async payForSearch(): Promise<string> {
    const user = this.wallet.publicKey;
    const [statePDA] = this.getStatePDA();
    const [vaultPDA] = this.getVaultPDA(statePDA);
    const [contributorPDA] = this.getContributorPDA(statePDA, user);

    const tx = await this.program.methods
      .payForSearch()
      .accountsStrict({
        user: user,
        state: statePDA,
        vault: vaultPDA,
        contributor: contributorPDA,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return await this.provider.sendAndConfirm(tx);
  }

  /**
   * Distribute rewards to multiple recipients
   * @param recipients Array of public keys to receive rewards
   * @param amounts Array of amounts (in lamports) to distribute to each recipient
   * @param options Optional transaction options
   * @returns Transaction signature
   */
  async distributeRewards(
    recipients: PublicKey[],
    amounts: number[]
  ): Promise<string> {
    if (recipients.length !== amounts.length) {
      throw new Error("Recipients and amounts arrays must have the same length");
    }

    const adminSigner = this.wallet.publicKey;
    const [statePDA] = this.getStatePDA();
    const [vaultPDA] = this.getVaultPDA(statePDA);

    const tx = await this.program.methods
      .distributeRewards(recipients, amounts.map(amount => new BN(amount)))
      .accountsStrict({
        state: statePDA,
        vault: vaultPDA,
        adminSigner: adminSigner,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return await this.provider.sendAndConfirm(tx, []);
  }

  /**
   * Get the current state of the program
   * @returns The state account data
   */
  async getState() {
    const [statePDA] = this.getStatePDA();
    return await this.program.account.state.fetch(statePDA);
  }

  /**
   * Get contributor information
   * @param userPubkey The user's public key
   * @returns The contributor account data
   */
  async getContributor(userPubkey: PublicKey) {
    const [statePDA] = this.getStatePDA();
    const [contributorPDA] = this.getContributorPDA(statePDA, userPubkey);
    return await this.program.account.contributor.fetch(contributorPDA);
  }

  /**
   * Get the current balance of the vault
   * @returns The vault balance in lamports
   */
  async getVaultBalance(): Promise<number> {
    const [statePDA] = this.getStatePDA();
    const [vaultPDA] = this.getVaultPDA(statePDA);
    const accountInfo = await this.connection.getAccountInfo(vaultPDA);
    return accountInfo?.lamports || 0;
  }
}