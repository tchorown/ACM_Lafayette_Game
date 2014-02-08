#pragma strict

var speed : int; // speed of rotation

function Start () {

}

function Update () {
	transform.Rotate(0,0,Time.deltaTime*speed);
}