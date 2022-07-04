//!
/* 函數元件在使用 hook 時，可能會遇到無限渲染的問題
原因是：在向函數子元件傳遞 setNumber 類的函數時
倘若是使用 myfunc() 的指令，會有馬上執行的效果
進而導致無限迴圈。
解決方案是：傳遞過程皆使用 reference 傳函數名稱
而最後的使用函數，也要改用匿名函數寫法。
*/
const Square = (props) =>
    <div
        className={props.isActive ? "square square-active" : "square"}
        onClick={() => props.onClick(props.id)}
    >
        {props.value}
    </div>

export default Square;