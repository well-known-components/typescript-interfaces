/**
 * @public
 */
export interface ISlackComponent {
  sendMessage(markdown: string): Promise<void>
}
