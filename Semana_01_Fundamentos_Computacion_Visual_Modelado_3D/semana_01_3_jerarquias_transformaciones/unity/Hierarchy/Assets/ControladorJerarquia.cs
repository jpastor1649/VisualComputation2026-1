using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ControladorJerarquia : MonoBehaviour
{
    [Header("Jerarquía 3D")]
    public Transform nodoPadre;
    public Transform nodoHijo;
    public Transform nodoNieto;
    public LineRenderer linea;

    [Header("Interfaz UI")]
    public Slider s_Pos;
    public Slider s_Rot;
    public Slider s_Escala;
    public TextMeshProUGUI textoDebug;
    public Button botonPausa;

    private bool estaAnimando = true;
    private float tiempo = 0f;

    void Start()
    {
        // Limites de los sliders
        s_Pos.minValue = -4f;    s_Pos.maxValue = 4f;
        s_Rot.minValue = 0f;     s_Rot.maxValue = 360f;
        s_Escala.minValue = 0.5f; s_Escala.maxValue = 2f; s_Escala.value = 1f;

        botonPausa.onClick.AddListener(() => estaAnimando = !estaAnimando);
        linea.positionCount = 3;
    }

    void Update()
    {
        // Movimiento de levitación del padre
        float levitacion = 0;
        if (estaAnimando) {
            tiempo += Time.deltaTime * 2f;
            levitacion = Mathf.Sin(tiempo) * 2f;
        }

        // Aplicar valores
        nodoPadre.position = new Vector3(s_Pos.value, levitacion, 0);
        nodoPadre.rotation = Quaternion.Euler(0, s_Rot.value, 0);
        nodoPadre.localScale = Vector3.one * s_Escala.value;

        // Actualizar la línea
        linea.SetPosition(0, nodoPadre.position);
        linea.SetPosition(1, nodoHijo.position);
        linea.SetPosition(2, nodoNieto.position);

        // Actualizar el texto
        textoDebug.text = $"<b>Valores del Padre</b>\n" +
                          $"Posición X: {s_Pos.value:F2}\n" +
                          $"Rotación Y: {s_Rot.value:F0}°\n" +
                          $"Escala: {s_Escala.value:F2}x";
    }
}