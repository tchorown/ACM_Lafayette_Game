#pragma strict
private var enemyCount : int;
var enemyList : GameObject[];



function Start () {

enemyList = GameObject.FindGameObjectsWithTag('Enemy') as GameObject[];
enemyCount = enemyList.Length;
Debug.Log(enemyCount);
}

function Update () {

}
function enemyCountUpdate(){

}