package com.cibertec.rentifydemo

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class AutoAdapter(
    private val autos: List<Auto>,
    private val onClickAuto: (Auto) -> Unit
) : RecyclerView.Adapter<AutoAdapter.AutoViewHolder>() {

    inner class AutoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvMarca: TextView = itemView.findViewById(R.id.tvMarca)
        val tvModelo: TextView = itemView.findViewById(R.id.tvModelo)
        val tvPrecio: TextView = itemView.findViewById(R.id.tvPrecio)
        val tvEstado: TextView = itemView.findViewById(R.id.tvEstado)
        val tvPlaca: TextView = itemView.findViewById(R.id.tvPlaca)
        val tvColor: TextView = itemView.findViewById(R.id.tvColor)
        val tvCategoria: TextView = itemView.findViewById(R.id.tvCategoria)
        val tvKilometraje: TextView = itemView.findViewById(R.id.tvKilometraje)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AutoViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_auto, parent, false)
        return AutoViewHolder(view)
    }

    override fun onBindViewHolder(holder: AutoViewHolder, position: Int) {
        val auto = autos[position]
        holder.tvMarca.text = "${auto.vehiculo.marca} ${auto.vehiculo.model}"
        holder.tvModelo.text = "${auto.vehiculo.version} - ${auto.vehiculo.year}"
        holder.tvPrecio.text = "S/. ${auto.vehiculo.precio}/día"
        holder.tvEstado.text = auto.estado
        holder.tvPlaca.text = "Placa: ${auto.placa}"
        holder.tvColor.text = "Color: ${auto.color}"
        holder.tvCategoria.text = auto.vehiculo.categoria
        holder.tvKilometraje.text = "${auto.kilometraje} km"

        // Color del estado
        holder.tvEstado.setTextColor(
            if (auto.estado.uppercase() == "DISPONIBLE")
                holder.itemView.context.getColor(android.R.color.holo_green_light)
            else
                holder.itemView.context.getColor(android.R.color.holo_red_light)
        )

        holder.itemView.setOnClickListener {
            onClickAuto(auto)
        }
    }

    override fun getItemCount() = autos.size
}