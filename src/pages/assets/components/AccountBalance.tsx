import {useApiData} from "../../../hooks/api";
import moment from "moment";
import {useMemo} from "react";
import CurrencyCell from "../../../components/display/CurrencyCell";
import {BalanceType} from "../hooks/Balances.context";

export default function AccountBalance ({account} : {account : string}) {
  // memos
  const parameters = useMemo(() => ({account}), [account]);
  // data
  const {data} = useApiData<BalanceType[]>(`balances/at/${moment().format('YYYY-MM-DD')}`, parameters);
  // memos
  const current = useMemo(() => {
    // check data
    if (!data) return;
    // find account balance
    return data.find(e => (e.account === account))
  }, [account, data]);
  // render
  return (
    <h1 className="text-nowrap display-4 text-center">
      { current?.amount === undefined && <>&hellip;</> }
      { current?.amount !== undefined && <CurrencyCell amount={current?.amount || 0.0} colored fracDigits={0} /> }
    </h1>
  );
}
