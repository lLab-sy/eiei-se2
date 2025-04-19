import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Transaction } from "./ProfileEdit";
  
export default function ProfessionalTransaction({
    transactionsData,
    handleRequestTransfer,
  }: {
    transactionsData: Transaction[],
    handleRequestTransfer: (transaction: Transaction) => void;
}) {
    const [transactions, setTransactions] = useState(transactionsData);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
    const handleConfirm = () => {
      if (selectedTx) {
        const updated = transactions.map(tx =>
          tx === selectedTx ? { ...tx, transferred: true } : tx
        );
        handleRequestTransfer(selectedTx); // Call the transfer function
        setTransactions(updated);
        setSelectedTx(null); // Close modal
        toast({
          variant: "default",
          title: "Success",
          description: `A request for the payment of ฿${selectedTx.amount.toFixed(2)} for the project "${selectedTx.project}" has been submitted.`,
        });
      }
    };
  
    const handleCancel = () => {
      setSelectedTx(null); // Close modal
    };
  
    return (
      <div>
        <h1 className="text-l font-bold mb-4 mt-2">Transaction History</h1>
  
        <div className="max-w-3xl mx-auto mt-6 shadow-md rounded-md overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Project</th>
                  <th className="px-4 py-2">Amount (THB)</th>
                  <th className="px-4 py-2">Transfer to bank account</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-800">
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">{tx.project}</td>
                    <td className="px-4 py-2">{tx.amount}</td>
                    <td className="px-4 py-2">
                      <Button
                        onClick={() => setSelectedTx(tx)}
                        type="reset"
                        className={`px-4 py-1 rounded-md font-medium ${
                          !tx.transferred
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={tx.transferred}
                      >
                        Transfer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Modal */}
        {selectedTx && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Transfer Confirmation</h2>
              <p className="mb-2">
                The payment of <strong>฿{selectedTx.amount.toFixed(2)}</strong> for project
                <br />
                <strong>"{selectedTx.project}"</strong> will be transferred to your registered bank account.
              </p>
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm">
                Please confirm this transaction. The transfer process typically takes 1-2 business days.
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}