package com.cibertec.rentifydemo

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class ReservaAdapter(private val reservas: List<ReservaResponse>) :
    RecyclerView.Adapter<ReservaAdapter.ReservaViewHolder>() {

    class ReservaViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvMarca: TextView       = view.findViewById(R.id.tvReservaMarca)
        val tvFechaInicio: TextView = view.findViewById(R.id.tvReservaFechaInicio)
        val tvFechaFin: TextView    = view.findViewById(R.id.tvReservaFechaFin)
        val tvPrecio: TextView      = view.findViewById(R.id.tvReservaPrecio)
        val tvEstado: TextView      = view.findViewById(R.id.tvReservaEstado)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReservaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_reserva, parent, false)
        return ReservaViewHolder(view)
    }

    override fun onBindViewHolder(holder: ReservaViewHolder, position: Int) {
        val reserva = reservas[position]
        val nombreMostrar = reserva.nombres
            ?: reserva.usuario?.nombres ?: "Reserva #${reserva.id}"

        holder.tvMarca.text       = nombreMostrar
        holder.tvFechaInicio.text = reserva.fecha_inicio?.take(10) ?: "—"
        holder.tvFechaFin.text    = reserva.fecha_fin?.take(10) ?: "—"
        holder.tvPrecio.text      = "$${reserva.precio_total}"
        holder.tvEstado.text      = reserva.estado ?: ""

        holder.itemView.setOnClickListener {
            val intent = android.content.Intent(it.context, DetalleReservaActivity::class.java)
            intent.putExtra("reserva_id",           reserva.id)
            intent.putExtra("reserva_nombres",      reserva.nombres ?: reserva.usuario?.nombres ?: "")
            intent.putExtra("reserva_email",        reserva.email ?: reserva.usuario?.email ?: "")
            intent.putExtra("reserva_fecha_inicio", reserva.fecha_inicio ?: "")
            intent.putExtra("reserva_fecha_fin",    reserva.fecha_fin ?: "")
            intent.putExtra("reserva_precio",       reserva.precio_total ?: 0.0)
            intent.putExtra("reserva_estado",       reserva.estado ?: "")
            intent.putExtra("reserva_auto", "${reserva.auto?.vehiculo?.marca ?: ""} ${reserva.auto?.vehiculo?.model ?: ""}".trim())
            it.context.startActivity(intent)
        }
    }

    override fun getItemCount() = reservas.size
}