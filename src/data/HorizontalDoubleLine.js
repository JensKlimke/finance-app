export const DoubleLine = ({color}) => {
  const style = `1px solid ${color || '#999'}`;
  return <div style={{borderTop: style, borderBottom: style, height: '5px'}}/>
}
